import { getGameInstance } from "@/core/game/get-Instance";
import { displayTimeGame } from "@/features/time/display";
import { data } from "@/modes/factory";
import { qs, makeText, setAttribute } from "@/page-loader";
import { STATE } from "@/types/state/state";

export default function setupGaming() {
  const gameInstance = getGameInstance();
  const INITIAL_TURN_COUNT = gameInstance.turnCurrentPlayer?.turnCount || 5;
  let currentTurnCount = INITIAL_TURN_COUNT;
  let id = null;

  gameInstance.data = data || null;
  // Initial UI setup
  makeText(qs("game.gameCurrentState") as HTMLElement, "IN GAME");
  setAttribute(qs("sidebar.paramsSpace") as HTMLElement, "display", "none");

  const start = Date.now();
  gameInstance.state = STATE.GAME;

  gameInstance.timerInterval = window.setInterval(
    () => displayTimeGame(start),
    1000
  );

  return { currentTurnCount, id, gameInstance };
}
