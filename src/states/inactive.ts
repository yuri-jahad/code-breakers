import { pageLoaderInstance as page } from "@/pageLoader";
import type { GameInterface } from "@/types/game/game-type";
import { hideGame } from "@/utils/hideGame";
import { STATE } from "@/game";
import { modesConfig } from "@/utils/modesConfig";


export default function inactive(game: GameInterface) {
	page.makeText(page.qs("game.gameCurrentState") as HTMLElement, STATE.INACTIVE);
	page.makeText(page.qs("game.gameStartAction") as HTMLButtonElement, STATE.START);
	game.state = STATE.INACTIVE;

	hideGame();
	modesConfig(game);
}
