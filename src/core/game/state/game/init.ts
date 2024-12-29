import { qs, makeText } from "@/router/page-loader";
import { IntervalId, IntervalType } from "@/types/game/turn";
import stateInactive from "@/core/game/state/game/inactive";
import stateStart from "@/core/game/state/game/start";
import stateWaiting from "@/core/game/state/game/waiting";
import stateGame from "@/core/game/state/game/gaming";
import stateEnd from "@/core/game/state/game/end";
import { STATE } from "@/types/game/states";
import handleUserRegistration from "@/core/user/authentification/register";
import getPlayerElements from "@/features/game/player/logic/get-elements";
import { getGameInstance } from "../../get-instance";

export default async function initGame() {
  const gameInstance = getGameInstance();
  stateInactive(gameInstance);
  await handleUserRegistration();
  (qs("game.startGameAction") as HTMLElement).addEventListener(
    "click",
    async function () {
      if (gameInstance.state === STATE.WAITING) {
        gameInstance.clearInterval(IntervalType.WAIT_STATE);
        stateInactive(gameInstance);
      } else if (
        gameInstance.state === STATE.INACTIVE ||
        gameInstance.state === STATE.END
      ) {
        gameInstance.setInterval(
          IntervalType.WAIT_STATE,
          (await stateWaiting()) as IntervalId
        );
        stateStart();
        stateGame();
      } else if (gameInstance.state === STATE.GAME) {
        stateEnd(gameInstance);
      }
    }
  );

  (qs("game.inputAnswer") as HTMLInputElement).addEventListener(
    "keyup",
    async (event) => {
      const target = event.target as HTMLInputElement;
      const playerElements = getPlayerElements(
        gameInstance.getCurrentPlayer?.id || 0
      );

      if (!playerElements) return;

      makeText(playerElements.playerAnswer, target.value);
      (qs("game.letterCount") as HTMLElement).textContent = String(
        target.value.length
      );
      if (event.key === "Enter") {
        if (target.value === gameInstance.puzzle.response) {
          await gameInstance
            .getTurnManagement("turnHandler")
            ?.handleCorrectAnswer();
        } else {
          gameInstance.gameSound.playSound("puzzleFailed");
          (qs("game.inputAnswer") as HTMLInputElement).value = "";
        }
      }
    }
  );
}
