import {
	BaseSelectorRenderType,
	SelectorConfig,
	BaseSelectorType,
} from "@/page-selector-type";

export default class PageSelector {
	public getSelector(
		selector: string,
		all: boolean = false
	): HTMLElement | NodeListOf<HTMLElement> | null {
		if (all) {
			const elements = document.querySelectorAll(selector);
			return elements as NodeListOf<HTMLElement>;
		}

		const element = document.querySelector(selector);
		return element as HTMLElement | null;
	}

	public makeText(element: HTMLElement, text: string): void {
		if (element) {
			if (element instanceof HTMLElement) {
				element.textContent = text;
			}
		}
	}

	public makeHTML(element: HTMLElement, html: string): void {
		if (element) {
			if (element instanceof HTMLElement) {
				element.innerHTML = html;
			}
		}
	}

	public setAttribute(
		element: HTMLElement,
		attribute: string,
		value: string
	): void {
		if (element) {
			if (element instanceof HTMLElement) {
				element.setAttribute(attribute, value);
			}
		}
	}

	public setStyle(element: HTMLElement, prop: string, value: string): void {
		if (element instanceof HTMLElement) {
			element.style.setProperty(prop, value);
		}
	}

	public setSelector(obj: BaseSelectorType): BaseSelectorRenderType {
		const selectors: BaseSelectorRenderType = {};

		Object.entries(obj || {}).forEach(([sectionKey, sectionValue]) => {
			if (typeof sectionValue === "object" && sectionValue !== null) {
				const sectionSelectors: {
					[key: string]: HTMLElement | NodeListOf<HTMLElement> | null;
				} = {};

				Object.entries(sectionValue as Record<string, SelectorConfig>).forEach(
					([elementKey, elementValue]) => {
						sectionSelectors[elementKey] = this.getSelector(
							elementValue.selector,
							elementValue.all ?? false
						);
					}
				);

				selectors[sectionKey] = sectionSelectors;
			}
		});

		return selectors;
	}
}
