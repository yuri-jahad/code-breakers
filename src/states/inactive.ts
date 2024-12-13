import { pageLoaderInstance as page } from "@/page-loader";
import type { GameInterface } from "@/types/game/game";
import { hideGame } from "@/utils/hide-game";
import { STATE } from "@/game";
import { modesConfig } from "@/utils/modesConfig";


export default function inactive(game: GameInterface) {
	page.makeText(page.qs("game.gameCurrentState") as HTMLElement, STATE.INACTIVE);
	page.makeText(page.qs("game.startGameAction") as HTMLButtonElement, STATE.START);
	game.state = STATE.INACTIVE;

	hideGame();
	modesConfig(game);
}
