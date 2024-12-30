import { getGameInstance } from "@/core/game/get-instance";
import { displayTimeGame } from "@/features/game/time/display/display";
import { qs, makeText, setAttribute } from "@/router/page-loader";
import { STATE } from "@/types/game/states";
import { data } from "@/core/game/modes/factory";

export default function setupGaming() {
  const gameInstance = getGameInstance();
  const INITIAL_TURN_COUNT =
    gameInstance.getTurnManagement("turnCurrentPlayer")?.turnCount || 5;
  let currentTurnCount = INITIAL_TURN_COUNT;
  let id = null;

  gameInstance.data = data || null;
  // Initial UI setup
  makeText(qs("game.gameCurrentState") as HTMLElement, "In-game");
  setAttribute(qs("sidebar.paramsSpace") as HTMLElement, "display", "none");

  const start = Date.now();
  gameInstance.state = STATE.GAME;

  gameInstance.timerInterval = window.setInterval(
    () => displayTimeGame(start),
    1000
  );

  return { currentTurnCount, id, gameInstance };
}
