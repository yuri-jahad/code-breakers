export default function getPlayer(id: number): HTMLElement | null {
	return document.querySelector(`[data-id="${id}"]`);
}
