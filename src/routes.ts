// routes.ts
import { selectors } from "@/page-selector-type";
import { PagesType } from "@/types";

export const PAGES_ROUTE: PagesType = {
	game: {
		template: "/pages/game.html",
		modules: {
			main: async () => {
				const module = await import("@/game");
				return module;
			},
		},
		selectors,
	},
	"404": {
		template: "/pages/404.html",
	},
};
