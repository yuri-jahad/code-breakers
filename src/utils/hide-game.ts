import { GameInterface } from "@/types/game/game";
import { hideGame } from "@/features/game/state/display-end";

export function resetGame(game: GameInterface) {
  if (game.intervals.player) {
    console.log("RESET GAME");
    hideGame();
    game.historique.clear();
    game.set("turnTime", game.getTurnManagement("turnTimeCompare") as number);
    clearInterval(game.intervals.player);
  }
}
