import { GameInterface } from "@/types/game/game-type";
import { STATE } from "../game";

export default function start(
  startAction: HTMLButtonElement | null,
  game: GameInterface
) {
  if (!startAction) return;

  startAction.style.display = "block";
  game.state = STATE.START;
  startAction.id = STATE.GAME;
  startAction.innerHTML = STATE.END;

  // Initialisation du mode de jeu
  game.initializeFactory(game.getMode || "code-http");
  game.gameSound.playSound("gameJoined", 0.1);

  // Affichage de l'énigme
  const entityElement = document.querySelector(".find-entity");
  if (entityElement && game.puzzle.request) {
    entityElement.innerHTML = game.puzzle.request;
  }

}
