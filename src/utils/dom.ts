export function isHTMLElement(element: unknown): element is HTMLElement {
	return element instanceof HTMLElement;
}

function partialUpdate<T>(obj: T, partial: Partial<T>) {
	return { ...obj, ...partial };
}


