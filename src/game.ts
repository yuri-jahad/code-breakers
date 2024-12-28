import { pageLoaderInstance as page, qs, makeText } from "@/page-loader";
import { IntervalId, IntervalType } from "@/types/game/turn";
import stateInactive from "@/states/inactive";
import stateStart from "@/states/start";
import stateWaiting from "@/states/waiting";
import stateGame from "@/states/gaming";
import stateEnd from "@/states/end";
import { displayTypingSpeed } from "@/features/speed/typing-display";
import { isGameWin } from "@/features/game/state/display-win";
import { updateScore } from "@/features/score/update";
import handleUserRegistration from "@/features/profile/user";
import { STATE } from "@/types/state/state";
import getPlayerElements from "./features/player/get-elements";
import { getGameInstance } from "./core/game/get-Instance";

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

      if (event.key === "Enter") {
        if (target.value === gameInstance.puzzle.response) {
          await gameInstance.getTurnManagement("turnHandler")?.handleCorrectAnswer();
        }
      }
    });
}
