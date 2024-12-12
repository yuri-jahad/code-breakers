import { pageLoaderInstance as page } from "@/pageLoader";
export function hideGame() {
	page.setAttribute(
		page.qs("game.gameAnswerContainer") as HTMLElement,
		"hidden",
		"true"
	);
	page.makeText(page.qs("game.gamePlayerContent") as HTMLElement, "");
}
