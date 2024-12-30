import { GameInterface } from "@/types/game/game";
import { resetGame } from "@/utils/hide-game";
import { STATE } from "@/types/game/states";
import { pageLoaderInstance as page } from "@/router/page-loader";

export default function stateEnd(game: GameInterface) {
	game.state = "End";
	page.makeText(page.qs("game.gameCurrentState") as HTMLElement, STATE.END);
	page.makeText(page.qs("game.startGameAction") as HTMLButtonElement, STATE.START);
	clearInterval(game.timerInterval as number);
	game.timerInterval = null;
	resetGame(game);
	console.log("Evènement END");
}
