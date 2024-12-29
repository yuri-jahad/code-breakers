import { STATE } from "@/types/game/states";
import { qs, makeText } from "@/router/page-loader";
import { getGameInstance } from "@/core/game/get-instance";
import displayStateStart from "@/features/game/state/display/start";

export default function start() {
  const gameInstance = getGameInstance();
  displayStateStart();
  gameInstance.state = STATE.START;
  // Initialisation du mode de jeu
  gameInstance.initializeFactory(gameInstance.get("mode") || "code-http");
  gameInstance.gameSound.playSound("gameJoined", 0.1);
  (qs("sidebar.chatBtn") as HTMLElement).click();
  // Affichage de l'énigme
  if (gameInstance.puzzle.request) {
    makeText(
      qs("game.currentPuzzle") as HTMLElement,
      gameInstance.puzzle.request
    );
  }
}
