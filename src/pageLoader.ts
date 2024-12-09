import { Cache, ModuleType } from "./types";
import { PAGES_ROUTE } from "./routes";
import PageSelector from "./pageSelector";

export class PageLoader extends PageSelector {
	private app: HTMLElement | null;
	private static instance: PageLoader | null = null;
	public cache: Cache;
	private lis: NodeListOf<HTMLLIElement> | null;
	constructor() {
		super();
		if (window.location.pathname.slice(1) !== "game") {
			window.history.pushState(null, "", "game");
		}
		this.app = document.querySelector("#app");
		this.lis = document.querySelectorAll("li");
		this.cache = this.initializeCache();
	}

	public static getInstance(): PageLoader {
		if (!PageLoader.instance) {
			PageLoader.instance = new PageLoader();
		}
		return PageLoader.instance;
	}

	private initializeCache(): Cache {
		const cache: Cache = {};
		Object.keys(PAGES_ROUTE).forEach(key => {
			cache[key] = {
				html: null,
				mainModule: null,
				additionalModules: [],
				selectorsElements: {},
			};
		});
		return cache;
	}

	public async initialize() {
		if (document.readyState === "loading") {
			// Si non, attendre l'événement DOMContentLoaded
			window.addEventListener("DOMContentLoaded", async () => {
				const currentPage = window.location.pathname.slice(1);
				await this.loadContent(currentPage);
			});
		} else {
			const currentPage = window.location.pathname.slice(1);
			await this.loadContent(currentPage);
		}

		window.addEventListener("popstate", async () => {
			const currentPage = window.location.pathname.slice(1);
			await this.loadContent(currentPage);
		});

		if (this.lis) {
			this.lis.forEach(li => {
				li.addEventListener("click", async (event: MouseEvent) => {
					event.preventDefault();
					const target = event.target as HTMLElement;
					if (target?.dataset.section) {
						window.history.pushState(null, "", target.dataset.section);
						await this.loadContent(target.dataset.section);
					}
				});
			});
		}
    return this.cache[window.location.pathname.slice(1)].selectorsElements;
	}

	private isModuleCached(pageName: string): boolean {
		const cachedPage = this.cache[pageName];
		if (!cachedPage) return false;

		const pageConfig = PAGES_ROUTE[pageName];
		const hasAdditionalModules = pageConfig?.modules?.additional?.length || 0;

		return !!(
			cachedPage.html &&
			cachedPage.mainModule &&
			(!hasAdditionalModules ||
				cachedPage.additionalModules.length === hasAdditionalModules)
		);
	}

	private async loadContent(pageName: string): Promise<void> {
		try {
			if (!PAGES_ROUTE[pageName]) {
				pageName = "404";
			}

			// Vérifier le cache
			if (this.isModuleCached(pageName)) {
				console.log("Chargement depuis le cache");
				await this.renderPage(pageName);
				return;
			}

			// Charger le HTML
			const htmlResponse = await fetch(PAGES_ROUTE[pageName].template);
			if (!htmlResponse.ok) throw new Error("Erreur de chargement HTML");
			const htmlContent = await htmlResponse.text();
			// Charger le module principal

			const mainModule = await PAGES_ROUTE[pageName].modules?.main();
    
			// Charger les modules additionnels
			const additionalModules = await this.loadAdditionalModules(pageName);
      
			// Mettre à jour le cache
			this.cache[pageName] = {
        html: htmlContent,
				mainModule: mainModule as ModuleType,
				additionalModules,
			};
      await this.renderPage(pageName);
			this.cache[pageName].selectorsElements = this.setSelector(PAGES_ROUTE[pageName].selectors || {});
		} catch (error) {
			console.error("Erreur de chargement de la page:", error);
			if (pageName !== "404") {
				await this.loadContent("404");
			}
		}
	}

	private async loadAdditionalModules(pageName: string): Promise<any[]> {
		const additionalImports = PAGES_ROUTE[pageName].modules?.additional || [];
		return Promise.all(additionalImports.map(importFn => importFn()));
	}

	private async renderPage(pageName: string): Promise<void> {
		const cachedPage = this.cache[pageName];
		if (!this.app || !cachedPage) return;

		this.app.innerHTML = cachedPage.html as string;

		await this.initializeModule(cachedPage.mainModule);

		for (const module of cachedPage.additionalModules) {
			await this.initializeModule(module);
		}
	}

	private async initializeModule(module: any): Promise<void> {
		if (module?.default && typeof module.default === "function") {
			await module.default();
		}
	}
	public getCurrentSelectors() {
		return this.cache[window.location.pathname.slice(1)].selectorsElements;
	}
}
