import { GameInterface } from "@/types/game/game.type";

export function hideGame() {
  const players: HTMLElement | null = document.querySelector(".players");
  const writeInput: HTMLInputElement | null = document.querySelector("#write");
  if (players && writeInput) {
    writeInput.hidden = true;
    players.innerHTML = "";
  }
}

export function resetGame(game: GameInterface) {
  if (game.intervals.player) {
    console.log("RESET GAME");
    hideGame();
    game.historique.clear();
    game.setTurnTime = game.turnTimeCompare || 5;
    clearInterval(game.intervals.player);
  }
}
