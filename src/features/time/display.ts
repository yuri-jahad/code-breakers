import { pageLoaderInstance as page } from "@/page-loader";

/** Affiche le temps de la partie pendant la période de jeu**/
export const displayTimeGame = (start: number) => {
  const currentTime = Date.now() - start;
  const hours = Math.floor(currentTime / 3600000);
  const minutes = Math.floor((currentTime % 3600000) / 60000);
  const seconds = Math.floor((currentTime % 60000) / 1000);
  const message = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  page.makeText(page.qs("infos.gameTimer") as HTMLElement, message);
};
