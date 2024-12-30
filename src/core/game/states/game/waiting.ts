import { STATE } from "@/types/game/states";
import { IntervalType } from "@/types/game/turn";
import { qs, setStyle, makeText } from "@/router/page-loader";
import { getGameInstance } from "@/core/game/get-instance";
import waitingStateDisplay from "@/features/game/states/waiting/loading/display/display";
import ParticleSystem from "@/features/game/states/waiting/loading/logic/loading";

type WaitingInterval = ReturnType<typeof setInterval>;

export default async function waiting(): Promise<WaitingInterval | null> {
  initializeWaitingState();
  return startWaitingCounter();
}

function initializeWaitingState() {
  const gameInstance = getGameInstance();
  setStyle(qs("rules.rulesSpace") as HTMLElement, "display", "none");
  waitingStateDisplay();

  ParticleSystem.init();
  ParticleSystem.start();

  gameInstance.state = STATE.WAITING;

  makeText(
    qs("game.startGameAction") as HTMLButtonElement,
    STATE.CANCEL_WAITING
  );
  updateWaitingUI(gameInstance.getWaitingCount);
  ParticleSystem.updateTimer(gameInstance.getWaitingCount);
}

function updateWaitingUI(count: number) {
  makeText(
    qs("game.gameCurrentState") as HTMLElement,
    `Game begins in ${count} seconds`
  );
  // Mettre à jour le timer dans le ParticleSystem
  ParticleSystem.updateTimer(count);
}

async function startWaitingCounter(): Promise<WaitingInterval | null> {
  const gameInstance = getGameInstance();
  let gameWaitingCount = gameInstance.getWaitingCount;

  return new Promise((resolve) => {
    const interval = window.setInterval(() => {
      // Jouer les sons avant de décrémenter le compteur
      if (gameWaitingCount > 0) {
        gameInstance.gameSound.playSound("countdown");
      }

      // Mettre à jour l'UI avec le compte actuel
      updateWaitingUI(gameWaitingCount);

      // Décrémenter après avoir joué les sons et mis à jour l'UI
      gameWaitingCount--;

      // Vérifier si le compte est terminé
      if (gameWaitingCount === -1) {
        ParticleSystem.stop();
        ParticleSystem.clear();
        resolve(interval as unknown as WaitingInterval);
      }
    }, 1000);

    gameInstance.setInterval(IntervalType.WAIT_STATE, interval);
  });
}
