import { STATE } from "@/types/state/state";
import { qs, makeText } from "@/page-loader";
import displayStartState from "../features/game/state/display-start";
import { getGameInstance } from "@/core/game/getInstance";
export default function start() {
	const gameInstance = getGameInstance();
	displayStartState();
	gameInstance.state = STATE.START;
	// Initialisation du mode de jeu
	gameInstance.initializeFactory(gameInstance.getMode || "code-http");
	gameInstance.gameSound.playSound("gameJoined", 0.1);

	// Affichage de l'énigme
	if (gameInstance.puzzle.request) {
		makeText(qs("game.currentPuzzle") as HTMLElement, gameInstance.puzzle.request);
	}
}
