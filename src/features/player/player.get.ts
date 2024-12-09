export function getPlayer(id: number) {
	const player: HTMLElement | null = document.querySelector(
		`[data-id="${id}"]`
	);
	if (player) {
		return player;
	}
	return null;
}
