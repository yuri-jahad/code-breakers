import { BaseSelectorRenderType, SelectorRenderTypeGame, SelectorsType } from "./page-selector";

// types.ts
export type ModuleType = {
	default: (selectors?: Record<string, string>) => void | Promise<void>;
};

export type ModuleImport = () => Promise<ModuleType>;

export type SelectorConfig = {
    selector: string;
};

export interface PageModules {
	main: ModuleImport;
	additional?: ModuleImport[];
}

export interface PageRoute {
	template: string;
	modules?: PageModules;
	selectors?: SelectorsType | {};
}

export interface PagesType {
	[key: string]: PageRoute;
}

export interface CachedModule<T = SelectorRenderTypeGame | BaseSelectorRenderType> {
    html: string | null;
    mainModule: ModuleType | null;
    additionalModules: ModuleType[];
    selectorsElements: T;
}
// Cache modifié pour être typé selon la page
export interface Cache {
    game: CachedModule<SelectorRenderTypeGame>;
    [key: string]: CachedModule<Record<string, unknown>>;
}

