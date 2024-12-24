import { getGameInstance } from "@/core/game/getInstance";
import { STATE } from "@/types/state/state";
import { IntervalType } from "@/types/game/turn";
import { qs, setStyle, makeText } from "@/page-loader";

type WaitingInterval = ReturnType<typeof setInterval>;

export default async function waiting(): Promise<WaitingInterval | null> {
  initializeWaitingState();
  return startWaitingCounter();
}

function initializeWaitingState() {
  const gameInstance = getGameInstance();
  setStyle(qs("rules.rulesSpace") as HTMLElement, "display", "none");
 
  gameInstance.state = STATE.WAITING;

  makeText(
    qs("game.startGameAction") as HTMLButtonElement,
    STATE.CANCEL_WAITING
  );
  updateWaitingUI(gameInstance.getWaitingCount);
}

function updateWaitingUI(count: number) {
  makeText(
    qs("game.gameCurrentState") as HTMLElement,
    `La partie va commencer dans ${count} secondes`
  );
}

async function startWaitingCounter(): Promise<WaitingInterval | null> {
  const gameInstance = getGameInstance();
  let gameWaitingCount = gameInstance.getWaitingCount;

  return new Promise((resolve) => {
    const interval = window.setInterval(() => {
      updateWaitingUI(gameWaitingCount);
      gameWaitingCount--;
      if (gameWaitingCount === -1) {
        resolve(interval as unknown as WaitingInterval);
      }
    }, 1000);

    gameInstance.setInterval(IntervalType.WAIT_STATE, interval);
  });
}
