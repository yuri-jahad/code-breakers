import { pageLoaderInstance as page } from "@/page-loader";
import { IntervalId, IntervalType } from "@/types/game/turn";
import { Game } from "@/core/game/game";
import { GameFactory } from "@/modes/factory";
import stateInactive from "@/states/inactive";
import stateStart from "@/states/start";
import stateWaiting from "@/states/waiting";
import stateGame from "@/states/game";
import stateEnd from "@/states/end";
import { displayTypingSpeed } from "@/features/speed/display-typing";
import { isGameWin } from "@/features/game/win";
import { updateScore } from "@/features/score/update";
import handleUserRegistration from "@/features/profile/user";
import extractPlayer from "@/features/player/extract";

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
	(page.qs("game.startGameAction") as HTMLElement).addEventListener("click", async function () {
		if (game.state === STATE.WAITING) {
			game.clearInterval(IntervalType.WAIT_STATE);
			stateInactive(game);
		} else if (game.state === STATE.INACTIVE || game.state === STATE.END) {
			game.setInterval(IntervalType.WAIT_STATE, (await stateWaiting(game)) as IntervalId);
			stateStart(game);
			stateGame(game);
		} else if (game.state === STATE.GAME) {
			stateEnd(game);
		}
	});

	(page.qs("game.inputAnswer") as HTMLInputElement).addEventListener("keyup", async event => {
		const target = event.target as HTMLInputElement;
		const playerExtract = extractPlayer(game.getCurrentPlayer?.id || 0);
		if (!playerExtract) return;

		page.makeText(playerExtract.answer, target.value);

		if (event.key === "Enter") {
			if (target.value === game.puzzle.response) {
				const currentPlayer = game.getCurrentPlayer;
				if (!currentPlayer) return;

				game.gameSound.playSound("puzzleSolved");
				currentPlayer.speed.end = Date.now();
				updateScore(currentPlayer, "correctWord");

				//page.makeText(playerExtract.answer, target.value);
				if (currentPlayer) {
					displayTypingSpeed(currentPlayer.speed.end - currentPlayer.speed.start);
				}
				const isComplete = isGameWin(game.historique.size, game.data?.length || 0);
				if (isComplete) {
					stateEnd(game);
					return;
				}
				game.nextTurnPlayer();
			} else {
				game.gameSound.playSound("puzzleFailed");
			}
			(page.qs("game.inputAnswer") as HTMLInputElement).value = "";
		}
	});
}

