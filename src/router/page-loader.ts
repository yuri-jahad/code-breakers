import { Cache, ModuleType } from "@/types/router/page-render";
import { PAGES_ROUTE } from "@/router/routes";
import PageSelector from "@/router/page-selector";
import {
	selectors,
	BaseSelectorRenderType,
	SelectorsKeysType,
	AllNestedKeys,
	SelectorRenderTypeGame,
	SelectorsType,
	SelectorPathAutocomplete,
} from "@/types/router/page-selector";

export class PageLoader extends PageSelector {
	private app: HTMLElement | null;
	private static instance: PageLoader | null = null;
	public cache: Cache;
	public currentPage: string;
	private lis: NodeListOf<HTMLLIElement> | null;
	private initialized = false;
	private initializationPromise: Promise<void> | null = null;

	constructor() {
		super();
		this.currentPage = window.location.pathname.slice(1) || "game";
		this.app = document.querySelector("#app");
		this.lis = document.querySelectorAll("li");
		this.cache = this.initializeCache();
	}

	private get isInitialized(): Promise<void> {
		if (this.initialized) return Promise.resolve();
		if (this.initializationPromise) return this.initializationPromise;
		return this.initialize();
	}

	public static getInstance(): PageLoader {
		if (!PageLoader.instance) {
			PageLoader.instance = new PageLoader();
		}
		return PageLoader.instance;
	}

	private initializeCache(): Cache {
		const cache: Cache = {} as Cache;
		const routes = PAGES_ROUTE || {};
		Object.keys(routes).forEach(key => {
			cache[key] = {
				html: null,
				mainModule: null,
				additionalModules: [],
				selectorsElements: this.createEmptySelectorRender(),
			};
		});
		return cache;
	}

	private createEmptySelectorRender(): SelectorRenderTypeGame | BaseSelectorRenderType {
		const empty: Partial<SelectorRenderTypeGame> = {};
		const selectorKeys = Object.keys(selectors) as SelectorsKeysType[];

		selectorKeys.forEach(section => {
			const sectionSelectors: Record<string, HTMLElement | NodeListOf<HTMLElement> | null> = {};
			const sectionKeys = Object.keys(selectors[section]);

			sectionKeys.forEach(key => {
				sectionSelectors[key] = null;
			});

			empty[section] = sectionSelectors as Record<AllNestedKeys, HTMLElement | NodeListOf<HTMLElement> | null>;
		});

		return empty as SelectorRenderTypeGame;
	}

	public async initialize(): Promise<void> {
		if (this.initialized) return;
		if (this.initializationPromise) return this.initializationPromise;

		this.initializationPromise = (async () => {
			try {
				// Marquer comme initialisé AVANT de charger le contenu
				this.initialized = true;

				if (document.readyState === "loading") {
					console.log("en attente du chargement du DOM");
					await new Promise<void>(resolve => {
						window.addEventListener("DOMContentLoaded", () => resolve());
					});
				}

				// Pré-initialiser les sélecteurs
				this.cache[this.currentPage].selectorsElements = this.createEmptySelectorRender();

				await this.loadContent(this.currentPage);
			} catch (error) {
				this.initialized = false;
				throw error;
			}
		})();

		return this.initializationPromise;
	}

	public qs<T extends SelectorsKeysType>(
		path: SelectorPathAutocomplete<T>
	): HTMLElement | NodeListOf<HTMLElement> | null {
		if (!this.initialized) {
			throw new Error(
				"PageLoader not initialized. Please await pageLoaderInstance.initialize() before using getSelectors"
			);
		}

		const page = window.location.pathname.slice(1) || "game";
		const [section, selector] = path.split(".");

		if (page === "game") {
			const gameSelectors = this.cache[page].selectorsElements as SelectorRenderTypeGame;
			return gameSelectors[section as SelectorsKeysType]?.[selector as keyof SelectorsType[T]] ?? null;
		}

		const otherSelectors = this.cache[page].selectorsElements as BaseSelectorRenderType;
		const selectors = otherSelectors[section]?.[selector];
		if (selectors instanceof HTMLElement) {
			return selectors;
		}
		return null;
	}

	private isModuleCached(pageName: string): boolean {
		const cachedPage = this.cache[pageName];
		if (!cachedPage) return false;

		const pageConfig = PAGES_ROUTE[pageName];
		if (!pageConfig) return false;

		const hasAdditionalModules = pageConfig.modules?.additional?.length || 0;

		return !!(
			cachedPage.html &&
			cachedPage.mainModule &&
			(!hasAdditionalModules || (cachedPage.additionalModules?.length ?? 0) === hasAdditionalModules)
		);
	}

	private async loadContent(pageName: string): Promise<void> {
		try {
			const validPageName = PAGES_ROUTE[pageName] ? pageName : "404";

			if (this.isModuleCached(validPageName)) {
				await this.renderPage(validPageName);
				return;
			}

			const pageConfig = PAGES_ROUTE[validPageName];
			if (!pageConfig?.template) {
				throw new Error(`Template not found for page: ${validPageName}`);
			}

			const htmlResponse = await fetch(pageConfig.template);
			if (!htmlResponse.ok) throw new Error("Erreur de chargement HTML");

			const htmlContent = await htmlResponse.text();
			const mainModule = (await pageConfig.modules?.main?.()) || null;
			const additionalModules = await this.loadAdditionalModules(validPageName);

			this.cache[validPageName] = {
				html: htmlContent,
				mainModule: mainModule as ModuleType,
				additionalModules,
				selectorsElements: this.createEmptySelectorRender(),
			};

			await this.renderPage(validPageName);
			this.cache[validPageName].selectorsElements = this.setSelector(pageConfig.selectors || {});
		} catch (error) {
			console.error("Erreur de chargement de la page:", error);
			if (pageName !== "404") {
				await this.loadContent("404");
			}
		}
	}

	private async loadAdditionalModules(pageName: string): Promise<ModuleType[]> {
		const additionalImports = PAGES_ROUTE[pageName]?.modules?.additional || [];
		try {
			const modules = await Promise.all(
				additionalImports.map(async importFn => {
					try {
						return await importFn();
					} catch {
						return null;
					}
				})
			);
			return modules.filter((module): module is ModuleType => module !== null);
		} catch {
			return [];
		}
	}

	private async renderPage(pageName: string): Promise<void> {
		const cachedPage = this.cache[pageName];
		if (!this.app || !cachedPage?.html) return;

		// Au lieu de remplacer tout le HTML
		if (!this.app.querySelector('[data-page="' + pageName + '"]')) {
			// Créer un nouveau container pour cette page
			const pageContainer = document.createElement("div");
			pageContainer.setAttribute("data-page", pageName);
			pageContainer.innerHTML = cachedPage.html;
			pageContainer.style.display = "none";
			this.app.appendChild(pageContainer);

			// Initialiser les sélecteurs une seule fois
			this.cache[pageName].selectorsElements = this.setSelector(PAGES_ROUTE[pageName]?.selectors || {});
		}

		// Cacher toutes les pages sauf celle qu'on veut afficher
		this.app.querySelectorAll("[data-page]").forEach(page => {
			(page as HTMLElement).style.display = "none";
		});

		// Afficher la page demandée
		const pageToShow = this.app.querySelector(`[data-page="${pageName}"]`);
		if (pageToShow) {
			(pageToShow as HTMLElement).style.display = "block";
		}

		// Initialiser les modules
		if (cachedPage.mainModule) {
			await this.initializeModule(cachedPage.mainModule);
		}

		for (const module of cachedPage.additionalModules || []) {
			if (module) {
				await this.initializeModule(module);
			}
		}
	}

	private async initializeModule(module: ModuleType | null): Promise<void> {
		if (!module?.default || typeof module.default !== "function") {
			return;
		}
		try {
			await module.default();
		} catch (error) {
			console.error("Error initializing module:", error);
		}
	}
}

const pageLoaderInstance = PageLoader.getInstance();

const qs = pageLoaderInstance.qs.bind(pageLoaderInstance);
const makeText = pageLoaderInstance.makeText.bind(pageLoaderInstance);
const setStyle = pageLoaderInstance.setStyle.bind(pageLoaderInstance);
const makeHTML = pageLoaderInstance.makeHTML.bind(pageLoaderInstance);
const setAttribute = pageLoaderInstance.setAttribute.bind(pageLoaderInstance);

export { pageLoaderInstance, qs, makeText, setStyle, makeHTML, setAttribute };
