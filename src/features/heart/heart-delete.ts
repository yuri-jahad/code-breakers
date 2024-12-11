import type { ProfileStats } from "@/types/profile/profile-type";

export function deleteHeartHTML(id: number) {
	const playerElement = document.querySelector(`[data-id="${id}"]`);
	if (playerElement) {
		const heartElement = playerElement.querySelector(".player-heart");
		if (heartElement) {
			heartElement.remove();
		}
	}
}

export function removeLife(currentPlayer: ProfileStats) {
	if (currentPlayer && currentPlayer.heart > 0) {
		deleteHeartHTML(currentPlayer.id || 0);
		currentPlayer.heart -= 1;
		if (currentPlayer.heart === 0) {
			return true;
		}
	}
	return false;
}
