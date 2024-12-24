import { GameInterface } from "@/types/game/game";
import { hideGame } from "@/features/game/state/display-end";


export function resetGame(game: GameInterface) {
  if (game.intervals.player) {
    console.log("RESET GAME");
    console.log('cc')
    hideGame();
    game.historique.clear();
    game.setTurnTime = game.turnTimeCompare || 5;
    clearInterval(game.intervals.player);
  }
}
