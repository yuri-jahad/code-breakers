import { IntervalId, IntervalType } from "@/types/game/game.turn.type";
import { Game } from "@/core/game/game";
import { GameFactory } from "@/modes/modes-factory";
import stateInactive from "@/states/inactive";
import stateStart from "@/states/start";
import stateWaiting from "@/states/waiting";
import stateGame from "@/states/game";
import stateEnd from "@/states/end";
import { displaySpeed } from "@/features/speed/speed-display";
import { isGameWin } from "@/features/game/game-win";
import { getPlayer } from "@/features/player/player-get";
import { updateScore } from "@/features/score/score-update";
import handleUserRegistration from "@/features/profile/profile-user";
import UserStorage from "@/core/user/user.storage";

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
	const stateElement: HTMLElement | null = document.querySelector(".state");
	const startAction: HTMLButtonElement | null =
		document.querySelector(".start-action");
	const writeInput: HTMLInputElement | null = document.querySelector("#write");
	const paramsDiv: HTMLElement | null = document.querySelector("#params");
	if (!startAction || !stateElement || !writeInput || !paramsDiv) return;
	stateInactive(startAction, game);
	await handleUserRegistration();

	startAction.addEventListener("click", async event => {
		const target = event.target as HTMLButtonElement;
		if (game.state === STATE.WAITING) {
			game.clearInterval(IntervalType.WAIT_STATE);
			stateInactive(startAction, game);
		} else if (target.id === STATE.INACTIVE || target.id === STATE.END) {
			game.setInterval(
				IntervalType.WAIT_STATE,
				(await stateWaiting(startAction, game, stateElement)) as IntervalId
			);
			stateStart(startAction, game);
			stateGame(writeInput, paramsDiv, game, stateElement);
		} else if (game.state === STATE.GAME) {
			stateEnd(game, startAction, paramsDiv);
		}
	});

	writeInput.addEventListener("keyup", async event => {
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
					displaySpeed(currentPlayer.speed.end - currentPlayer.speed.start);
				}
				const isComplete = isGameWin(
					game.historique.size,
					game.data?.length || 0
				);
				if (isComplete) {
					stateEnd(game, document.querySelector(".start-action"), paramsDiv);
					return;
				}
				game.nextTurnPlayer();
			} else {
				writeInput.value = "";
				game.gameSound.playSound("puzzleFailed");
			}
		}
	});
}
