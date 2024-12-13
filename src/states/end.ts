import { GameInterface } from "@/types/game/game-type";
import { resetGame } from "@/utils/hideGame";
import { STATE } from "@/game";
import { pageLoaderInstance as page } from "@/pageLoader";

export default function stateEnd(game: GameInterface) {
	game.state = "end";

	page.makeText(page.qs("game.gameCurrentState") as HTMLElement, STATE.END);
	page.makeText(page.qs("game.gameStartAction") as HTMLButtonElement, STATE.START);
	clearInterval(game.timerInterval as number);
	game.timerInterval = null;
	resetGame(game);
	console.log("Evènement END");
}
