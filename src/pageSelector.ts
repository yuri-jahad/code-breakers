import { SelectorRenderType } from "./page-selector-type";
import { SelectorElementsType, SelectorGlobalType } from "./types";

export default class PageSelector {
	public getSelector(selector: string, all: boolean = false) {
		return all
			? document.querySelectorAll(selector)
			: document.querySelector(selector);
	}

	public setSelector(obj: SelectorGlobalType): SelectorElementsType {
		const selectors: SelectorElementsType = {};

		Object.entries(obj).forEach(([sectionKey, sectionValue]) => {
			selectors[sectionKey] = Object.entries(sectionValue).reduce(
				(acc, [elementKey, elementValue]) => ({
					...acc,
					[elementKey]: this.getSelector(
						elementValue.selector,
						elementValue.all ?? false
					),
				}),
				{} as any
			);
		});

		return selectors;
	}
}
