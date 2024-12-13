import type { ProfileStats } from "@/types/profile/profile-type";
import { pageLoaderInstance as page } from "@/pageLoader";

export const displayScore = (currentPlayer: ProfileStats) => {
	page.makeText(page.qs("infos.infosCorrectWord") as HTMLElement, currentPlayer.correctWord.toString());
	page.makeText(page.qs("infos.infosFailWord") as HTMLElement, currentPlayer.failWord.toString());
};
