import { pageLoaderInstance as page } from "@/pageLoader";
import type { GameInterface } from "@/types/game/game-type";
import { hideGame } from "@/utils/hideGame";
import { STATE } from "@/game";
import { modesConfig } from "@/utils/modesConfig";

console.log(page.cache);

export default function inactive(game: GameInterface) {
	page.makeText(
		page.qs("game.gameCurrentState") as HTMLElement,
		STATE.INACTIVE
	);
	page.makeText(
		page.qs("game.gameStartAction") as HTMLButtonElement,
		STATE.START
	);
	page.setAttribute(
		page.qs("game.gameStartAction") as HTMLButtonElement,
		"data-set-state",
		STATE.INACTIVE
	);

	game.state = STATE.INACTIVE;

	hideGame();
	modesConfig(game);
}
