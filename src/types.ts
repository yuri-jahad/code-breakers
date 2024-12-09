// types.ts
export type ModuleType = {
	default: (selectors?: Record<string, string>) => void | Promise<void>;
};

export type ModuleImport = () => Promise<ModuleType>;

export interface SelectorType {
	[key: string]: {
		selector: string;
		all?: boolean;
	};
}

export type SelectorElementsType = Record<
	keyof SelectorType,
	HTMLElement | null
>;

export interface PageModules {
	main: ModuleImport;
	additional?: ModuleImport[];
}

export interface PageRoute {
	template: string;
	modules?: PageModules;
	selectors?: SelectorType;
}

export interface PagesType {
	[key: string]: PageRoute;
}

export interface CachedModule {
	html: string | null;
	mainModule: ModuleType | null;
	additionalModules: ModuleType[];
	selectorsElements?: SelectorElementsType;
}

export interface Cache {
	[key: string]: CachedModule;
}
