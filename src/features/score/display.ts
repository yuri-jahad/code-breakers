import type { ProfileStats } from "@/types/profile/type";
import { pageLoaderInstance as page } from "@/page-loader";

export const displayScore = (currentPlayer: ProfileStats) => {
	page.makeText(page.qs("infos.correctWord") as HTMLElement, currentPlayer.correctWord.toString());
	page.makeText(page.qs("infos.failWord") as HTMLElement, currentPlayer.failWord.toString());
};
