import { Cache, ModuleType } from "@/types";
import { PAGES_ROUTE } from "@/routes";
import PageSelector from "@/pageSelector";
import {
    selectors,
    BaseSelectorRenderType,
    SelectorRenderType,
    SelectorsKeysType,
    AllNestedKeys,
    SelectorRenderTypeGame,
    SelectorPath,
    SelectorsType,
    SelectorPathAutocomplete,
} from "@/page-selector-type";

export class PageLoader extends PageSelector {
    private app: HTMLElement | null;
    private static instance: PageLoader | null = null;
    public cache: Cache;
    private lis: NodeListOf<HTMLLIElement> | null;
    private initialized = false;
    private initializationPromise: Promise<void> | null = null;

    constructor() {
        super();
        const defaultPath = "game";
        if (window.location.pathname.slice(1) !== defaultPath) {
            window.history.pushState(null, "", defaultPath);
        }
        this.app = document.querySelector("#app") || document.createElement("div");
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
        
        selectorKeys.forEach((section) => {
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
            if (document.readyState === "loading") {
                await new Promise<void>(resolve => {
                    window.addEventListener("DOMContentLoaded", () => resolve());
                });
            }

            const currentPage = window.location.pathname.slice(1) || "game";
            await this.loadContent(currentPage);

            window.addEventListener("popstate", async () => {
                const newPage = window.location.pathname.slice(1) || "game";
                await this.loadContent(newPage);
            });

            if (this.lis) {
                this.lis.forEach(li => {
                    li.addEventListener("click", async (event: MouseEvent) => {
                        event.preventDefault();
                        const target = event.target as HTMLElement;
                        const section = target?.dataset?.section;
                        if (section) {
                            window.history.pushState(null, "", section);
                            await this.loadContent(section);
                        }
                    });
                });
            }

            this.initialized = true;
        })();

        await this.initializationPromise;
    }

    public getSelectors<T extends SelectorsKeysType>(
        path: SelectorPathAutocomplete<T>
    ): HTMLElement | NodeListOf<HTMLElement> | null {
        if (!this.initialized) {
            throw new Error('PageLoader not initialized. Please await pageLoaderInstance.initialize() before using getSelectors');
        }

        const page = window.location.pathname.slice(1) || "game";
        const [section, selector] = path.split(".");
        
        if (page === 'game') {
            const gameSelectors = this.cache[page].selectorsElements as SelectorRenderTypeGame;
            return gameSelectors[section as SelectorsKeysType]?.[selector as keyof SelectorsType[T]] ?? null;
        }
        
        const otherSelectors = this.cache[page].selectorsElements as BaseSelectorRenderType;
        return otherSelectors[section]?.[selector] ?? null;
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
            (!hasAdditionalModules ||
                (cachedPage.additionalModules?.length ?? 0) === hasAdditionalModules)
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
            const mainModule = await pageConfig.modules?.main?.() || null;
            const additionalModules = await this.loadAdditionalModules(validPageName);

            this.cache[validPageName] = {
                html: htmlContent,
                mainModule: mainModule as ModuleType,
                additionalModules,
                selectorsElements: this.createEmptySelectorRender()
            };

            await this.renderPage(validPageName);
            this.cache[validPageName].selectorsElements = this.setSelector(
                pageConfig.selectors || {}
            );
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
        
        this.app.innerHTML = cachedPage.html;
        
        if (cachedPage.mainModule) {
            await this.initializeModule(cachedPage.mainModule);
        }

        for (const module of (cachedPage.additionalModules || [])) {
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

// Initialisation immédiate mais non bloquante
pageLoaderInstance.initialize().catch(console.error);

export { pageLoaderInstance };