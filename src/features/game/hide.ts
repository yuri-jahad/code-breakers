import { pageLoaderInstance as page } from "@/page-loader";
export function hideGame() {
	page.setAttribute(page.qs("game.answerSpace") as HTMLElement, "hidden", "true");
	page.makeText(page.qs("game.activePlayers") as HTMLElement, "");
}
