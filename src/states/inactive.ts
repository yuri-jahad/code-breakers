import type { GameInterface } from "@/types/game/game-type";

import { hideGame } from "@/utils/hideGame";
import { STATE } from "@/game";
import { modesConfig } from "@/utils/modesConfig";

export default function inactive(
  startAction: HTMLButtonElement | null,
  game: GameInterface
) {
  if (startAction) {
    const stateElement = document.querySelector(".state");
    if (!stateElement) return;
    startAction.innerHTML = STATE.START;
    stateElement.innerHTML = STATE.INACTIVE;
    startAction.id = STATE.INACTIVE;
    game.state = STATE.INACTIVE;
    hideGame();
    modesConfig(game);
  }
}
