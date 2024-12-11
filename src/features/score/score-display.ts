import type { ProfileStats } from "@/types/profile/profile-type";

export const displayScore = (currentPlayer: ProfileStats) => {
	const displayCorrectWord = document.querySelector(".displayCorrectWord");
	const displayFailWord = document.querySelector(".displayFailWord");
	const displaySpeed = document.querySelector(".displaySpeed");

	if (!displayCorrectWord || !displayFailWord || !displaySpeed) return;
	displayCorrectWord.textContent = "";
	displayFailWord.textContent = "";
	displayCorrectWord.textContent = currentPlayer.correctWord.toString();
	displayFailWord.textContent = currentPlayer.failWord.toString();
};
