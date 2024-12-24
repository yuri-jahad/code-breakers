import { addPlayers } from "@/features/player/add";
import { STATE } from "@/types/state/state";
import game from "@/core/game/getInstance";
import { qs, makeText, setStyle } from "@/page-loader";
import CircleManager from "@/utils/draw-circle";

export default function displayStateStart() {
  // on additionne les joueurs aux bots, donc +1 (joueur 😊)
  const numberOfPlayers = (game.getBot ?? 0) + 1;
  const players = addPlayers(numberOfPlayers);
  
  CircleManager.animate({ duration: (game.getTurnTime || 5) * 1000 });
  game.setPlayers = players.getPlayers;
  (qs("game.playersSpace") as HTMLElement).classList.remove("hidden");

  setStyle(qs("game.startGameAction") as HTMLElement, "display", "block");
  makeText(qs("game.startGameAction") as HTMLElement, STATE.END);
  (qs("infos.infosSpace") as HTMLElement).classList.remove("hidden");
}
