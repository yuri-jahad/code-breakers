import type { GameInterface } from "@/types/game/game-type";
import { STATE } from "@/game";
import { addPlayers } from "@/features/player/player-add";
import { IntervalType } from "@/types/game/game-turn.type";
import { pageLoaderInstance as page } from "@/pageLoader";

type WaitingInterval = ReturnType<typeof setInterval>;

export default async function waiting(
	game: GameInterface
): Promise<WaitingInterval | null> {
	initializeWaitingState(game);
	return startWaitingCounter(game);
}

function initializeWaitingState(game: GameInterface) {
	const table: HTMLElement | null = document.querySelector("table");

	if (!table) return;
	page.setStyle(page.qs("helper.helperRules") as HTMLElement, "display", "none");
	page.setStyle(page.qs("infos.infosCurrentPlayer") as HTMLElement, "display", "flex");
	
	(page.qs("infos.infosCurrentPlayer") as HTMLElement).classList.add("flex");

	const numberOfPlayers = (game.getBot ?? 0) + 1;
	const players = addPlayers(numberOfPlayers, game);

	if (!players) return null;
	game.setPlayers = players.getPlayers;
	game.state = STATE.WAITING;

	(page.qs("game.gameStartAction") as HTMLButtonElement).textContent =
		STATE.CANCEL_WAITING;

	updateWaitingUI(game.getWaitingCount);
}

function updateWaitingUI(count: number) {
	(
		page.qs("game.gameCurrentState") as HTMLElement
	).textContent = `La partie va commencer dans ${count} secondes`;
}

async function startWaitingCounter(
	game: GameInterface
): Promise<WaitingInterval | null> {
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
