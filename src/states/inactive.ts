import { pageLoaderInstance as page } from "@/pageLoader";
import type { GameInterface } from "@/types/game/game-type";
import { hideGame } from "@/utils/hideGame";
import { STATE } from "@/game";
import { modesConfig } from "@/utils/modesConfig";

console.log(page.cache)

export default function inactive(game: GameInterface) {
	(page.qs("game.gameStartAction") as HTMLButtonElement).textContent =
		STATE.START;
	(page.qs("game.gameCurrentState") as HTMLElement).textContent =
		STATE.INACTIVE;
	(page.qs("game.gameStartAction") as HTMLButtonElement).id = STATE.INACTIVE;
	game.state = STATE.INACTIVE;

	hideGame();
	modesConfig(game);
}
