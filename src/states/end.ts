import { GameInterface } from "@/types/game/game-type";
import { resetGame } from "@/utils/hideGame";
import { STATE } from "@/game";

export default function stateEnd(
  game: GameInterface,
  startAction: HTMLButtonElement | null,
  paramsDiv: HTMLElement | null
) {
  game.state = "end";
  const stateElement = document.querySelector(".state");
  if (!startAction || !paramsDiv || !stateElement) return;
  paramsDiv.style.display = "block";
  stateElement.innerHTML = STATE.END;
  startAction.id = STATE.END;
  startAction.innerHTML = STATE.START;
  clearInterval(game.timerInterval as number);
  game.timerInterval = null;
  resetGame(game);
  console.log("Evènement END");
}
