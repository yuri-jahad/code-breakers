import { pageLoaderInstance as page } from "@/page-loader";
import type { GameInterface } from "@/types/game/game";
import { STATE } from "@/types/state/state";
import gameSettings from "@/utils/game-settings";

export default function inactive(game: GameInterface) {
  page.makeText(
    page.qs("game.gameCurrentState") as HTMLElement,
    STATE.INACTIVE
  );
  page.makeText(
    page.qs("game.startGameAction") as HTMLButtonElement,
    STATE.START
  );
  game.state = STATE.INACTIVE;

  gameSettings(game);
}
