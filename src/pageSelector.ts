import { SelectorElementsType } from "./types";

export default class PageSelector {
	public getSelector(selector: string, all: boolean = false) {
		return all
			? document.querySelectorAll(selector)
			: document.querySelector(selector);
	}

	public setSelector(obj: Record<string, { selector: string; all?: boolean }>) {
		const selectors: SelectorElementsType = {};
		Object.entries(obj).forEach(([key, value]) => {
			if (value.all) {
				selectors[key] = this.getSelector(
					value.selector,
					true
				) as HTMLElement | null;
			} else {
				selectors[key] = this.getSelector(value.selector) as HTMLElement | null;
			}
		});
		return selectors;
	}
}
