import { pageLoaderInstance as page } from "@/pageLoader";
import { IntervalId, IntervalType } from "@/types/game/game-turn.type";
import { Game } from "@/core/game/game";
import { GameFactory } from "@/modes/modes-factory";
import stateInactive from "@/states/inactive";
import stateStart from "@/states/start";
import stateWaiting from "@/states/waiting";
import stateGame from "@/states/game";
import stateEnd from "@/states/end";
import { displayTypingSpeed } from "@/features/speed/speed-typing-display";
import { isGameWin } from "@/features/game/game-win";
import { getPlayer } from "@/features/player/player-get";
import { updateScore } from "@/features/score/score-update";
import handleUserRegistration from "@/features/profile/profile-user";

export const STATE = {
	INACTIVE: "inactive",
	WAITING: "waiting",
	CANCEL_WAITING: "cancel-waiting",
	START: "start",
	GAME: "game",
	END: "end",
} as const;

export default async function initGame() {
	const gameFactory = new GameFactory();
	const game = new Game(gameFactory);
	stateInactive(game);
	await handleUserRegistration();
	console.log("initGame");
	(page.qs("game.gameStartAction") as HTMLElement).addEventListener(
		"click",
		async event => {
			const target = event.target as HTMLButtonElement;
			if (game.state === STATE.WAITING) {
				game.clearInterval(IntervalType.WAIT_STATE);
				stateInactive(game);
			} else if (target.dataset.setState === STATE.INACTIVE || target.dataset.setState === STATE.END) {
				game.setInterval(
					IntervalType.WAIT_STATE,
					(await stateWaiting(game)) as IntervalId
				);
				stateStart(game);
				stateGame(game);
			} else if (game.state === STATE.GAME) {
				stateEnd(game);
			}
		}
	);

	(page.qs("game.gameInputAnswer") as HTMLInputElement).addEventListener(
		"keyup",
		async event => {
			const target = event.target as HTMLInputElement;
			const playerElement: HTMLElement | null = getPlayer(
				game.getCurrentPlayer?.id || 0
			);
			if (!playerElement) return;
			const wordElement: HTMLElement | null =
				playerElement.querySelector(".word");
			if (!wordElement) return;
			wordElement.textContent = target.value;

			if (event.key === "Enter") {
				if (target.value === game.puzzle.response) {
					game.gameSound.playSound("puzzleSolved");
					const currentPlayer = game.getCurrentPlayer;
					if (currentPlayer) {
						currentPlayer.speed.end = Date.now();
						updateScore(currentPlayer, "correctWord");
					}
					wordElement.textContent = "";
					target.value = "";
					if (currentPlayer) {
						displayTypingSpeed(currentPlayer.speed.end - currentPlayer.speed.start);
					}
					const isComplete = isGameWin(
						game.historique.size,
						game.data?.length || 0
					);
					if (isComplete) {
						stateEnd(game);
						return;
					}
					game.nextTurnPlayer();
				} else {
					(page.qs("game.gameInputAnswer") as HTMLInputElement).value = "";
					game.gameSound.playSound("puzzleFailed");
				}
			}
		}
	);
}
