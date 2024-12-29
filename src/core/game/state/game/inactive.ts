import { pageLoaderInstance as page } from "@/router/page-loader";
import type { GameInterface } from "@/types/game/game";
import { STATE } from "@/types/game/states";
import gameSettings from "@/utils/settings-game";

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
