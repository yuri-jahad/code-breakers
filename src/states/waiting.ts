import type { GameInterface } from "@/types/game/game";
import { STATE } from "@/game";
import { addPlayers } from "@/features/player/add";
import { IntervalType } from "@/types/game/turn";
import { pageLoaderInstance as page } from "@/page-loader";

type WaitingInterval = ReturnType<typeof setInterval>;

export default async function waiting(game: GameInterface): Promise<WaitingInterval | null> {
	initializeWaitingState(game);
	return startWaitingCounter(game);
}

function initializeWaitingState(game: GameInterface) {
	page.setStyle(page.qs("rules.rulesSpace") as HTMLElement, "display", "none");
	game.state = STATE.WAITING;

	page.makeText(page.qs("game.startGameAction") as HTMLButtonElement, STATE.CANCEL_WAITING);
	updateWaitingUI(game.getWaitingCount);
}

function updateWaitingUI(count: number) {
	page.makeText(page.qs("game.gameCurrentState") as HTMLElement, `La partie va commencer dans ${count} secondes`);
}

async function startWaitingCounter(game: GameInterface): Promise<WaitingInterval | null> {
	let gameWaitingCount = game.getWaitingCount;

	return new Promise(resolve => {
		const interval = window.setInterval(() => {
			updateWaitingUI(gameWaitingCount);
			gameWaitingCount--;
			if (gameWaitingCount === -1) {
				resolve(interval as unknown as WaitingInterval);
			}
		}, 1000);

		game.setInterval(IntervalType.WAIT_STATE, interval);
	});
}
