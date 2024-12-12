import { GameInterface } from "@/types/game/game-type";
import { STATE } from "@/game";
import { pageLoaderInstance as page } from "@/pageLoader";

export default function start(game: GameInterface) {
	game.state = STATE.START;

	page.setStyle(page.qs("game.gameStartAction") as HTMLElement, "display", "block");
	page.setAttribute(page.qs("game.gameStartAction") as HTMLElement, "data-set-state", STATE.GAME);
	page.makeText(page.qs("game.gameStartAction") as HTMLElement, STATE.END);

	// Initialisation du mode de jeu
	game.initializeFactory(game.getMode || "code-http");
	game.gameSound.playSound("gameJoined", 0.1);

	// Affichage de l'énigme
	if (game.puzzle.request) {
		page.makeText(page.qs("game.gameFindEntity") as HTMLElement, game.puzzle.request);
	}
}
