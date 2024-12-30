import { qs } from "@/router/page-loader";
export function hideGame() {
  (qs("game.players") as HTMLElement).innerHTML = "";
  (qs("game.playersSpace") as HTMLElement).classList.add("hidden");
  (qs("infos.infosSpace") as HTMLElement).classList.add("hidden");
}
