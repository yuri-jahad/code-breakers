export const getPlayer = (id: number): HTMLElement | null => 
	document.querySelector(`[data-id="${id}"]`);