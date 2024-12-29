// routes.ts
import { selectors } from "@/types/router/page-selector";
import { PagesType } from "@/types/router/page-render";

export const PAGES_ROUTE: PagesType = {
	game: {
		template: "/pages/game.html",
		modules: {
			main: async () => {
				const module = await import("@/core/game/state/game/init");
				return module;
			},
		},
		selectors,
	},
	"404": {
		template: "/pages/404.html",
	},
};
