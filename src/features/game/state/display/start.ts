import { STATE } from "@/types/game/states";
import { qs, makeText, setStyle } from "@/router/page-loader";
import { addPlayers } from "../../player/logic/add";
import { getGameInstance } from "@/core/game/get-instance";

export default function displayStateStart() {
  // on additionne les joueurs aux bots, donc +1 (joueur 😊)
  const gameInstance = getGameInstance();
  const numberOfPlayers = (gameInstance.get("bot") ?? 0) + 1;
  const players = addPlayers(numberOfPlayers);

  gameInstance.setPlayers = players.getPlayers;
  (qs("game.playersSpace") as HTMLElement).classList.remove("hidden");

  setStyle(qs("game.startGameAction") as HTMLElement, "display", "block");
  makeText(qs("game.startGameAction") as HTMLElement, STATE.END);
  (qs("infos.infosSpace") as HTMLElement).classList.remove("hidden");
}
