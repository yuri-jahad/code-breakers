import { PagesType } from "./types";

export const PAGES_ROUTE: PagesType = {
	game: {
		template: "/pages/game.html",
		modules: {
			main: () => import("@/game"),
		},
		selectors: {
			write: { selector: "#write"},
      state: { selector: ".state"},
      startAction: { selector: ".start-action"},
      params: { selector: "#params"},
      players: { selector: ".players"},
		},
	},
	"404": {
		template: "/pages/404.html",
	},
};

