import { selectors } from "@/page-selector-type";
import { PagesType } from "@/types";

export const PAGES_ROUTE: PagesType = {
	game: {
		template: "/pages/game.html",
		modules: {
			main: () => import("@/game"),
		},
		selectors,
	},
	"404": {
		template: "/pages/404.html",
	},
};

async function initialize() {
    // Attendre que toute la configuration soit chargée
	import('@/index.css')
    await Promise.resolve();
    // Charger main en dernier
    await import('@/main');
}

initialize();