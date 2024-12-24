import { GameInterface } from "@/types/game/game";
import { resetGame } from "@/utils/hide-game";
import { STATE } from "@/types/state/state";
import { pageLoaderInstance as page } from "@/page-loader";

export default function stateEnd(game: GameInterface) {
	game.state = "end";
	page.makeText(page.qs("game.gameCurrentState") as HTMLElement, STATE.END);
	page.makeText(page.qs("game.startGameAction") as HTMLButtonElement, STATE.START);
	clearInterval(game.timerInterval as number);
	game.timerInterval = null;
	resetGame(game);
	console.log("Evènement END");
}
