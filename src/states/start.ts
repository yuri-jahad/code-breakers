import { GameInterface } from "@/types/game/game";
import { STATE } from "@/game";
import { pageLoaderInstance as page } from "@/page-loader";
import { addPlayers } from "@/features/player/add";

export default function start(game: GameInterface) {
	game.state = STATE.START;
	const numberOfPlayers = (game.getBot ?? 0) + 1;
	const players = addPlayers(numberOfPlayers);

	if (!players) return null;
	game.setPlayers = players.getPlayers;
	page.setStyle(page.qs("game.startGameAction") as HTMLElement, "display", "block");
	page.makeText(page.qs("game.startGameAction") as HTMLElement, STATE.END);
	console.log(page.qs("infos.infosSpace") as HTMLElement);
	(page.qs("infos.infosSpace") as HTMLElement).classList.remove("hidden");

	// Initialisation du mode de jeu
	game.initializeFactory(game.getMode || "code-http");
	game.gameSound.playSound("gameJoined", 0.1);

	// Affichage de l'énigme
	if (game.puzzle.request) {
		page.makeText(page.qs("game.currentPuzzle") as HTMLElement, game.puzzle.request);
	}
}
