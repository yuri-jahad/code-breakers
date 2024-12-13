// modesConfig.ts
import { STATE } from "@/game";
import { GameInterface } from "@/types/game/game";
import { ModesNames } from "@/types/game/modes";
import { pageLoaderInstance as page } from "@/page-loader";
function modesConfig(game: GameInterface) {

	const bindNumericInputs = (input: HTMLInputElement, range: HTMLInputElement, setter: (value: number) => void) => {
		input.addEventListener("change", () => {
			if (game.state === STATE.GAME) return;
			if (input.value) {
				const value = parseInt(input.value);
				setter(value);
				range.value = input.value;
			}
		});

		range.addEventListener("change", () => {
			if (game.state === STATE.GAME) return;
			if (range.value) {
				const value = parseInt(range.value);
				setter(value);
				input.value = range.value;
			}
		});
	};

	// Initialisation des valeurs
	game.setMode = (page.qs("params.selectMode") as HTMLSelectElement)?.value as ModesNames;
	game.setBot = parseInt((page.qs("params.botsInput") as HTMLInputElement)?.value || "0");
	game.setTurnTime = parseInt((page.qs("params.turnTimeInput") as HTMLInputElement)?.value || "5");
	game.setMinHeart = parseInt((page.qs("params.minHeartsInput") as HTMLInputElement)?.value || "1");
	game.setMaxHeart = parseInt((page.qs("params.maxHeartsInput") as HTMLInputElement)?.value || "10");
	game.setTurnTimeCompare = game.turnTime;

	game.initializeFactory((page.qs("params.selectMode") as HTMLSelectElement)?.value as ModesNames);

	// Event listener pour le changement de mode
	(page.qs("params.selectMode") as HTMLSelectElement)?.addEventListener("change", () => {
		if (game.state === STATE.GAME) return;
		game.initializeFactory((page.qs("params.selectMode") as HTMLSelectElement)?.value as ModesNames);
	});

	// Binding des inputs numériques
	bindNumericInputs(
		page.qs("params.turnTimeInput") as HTMLInputElement,
		page.qs("params.turnTimeRange") as HTMLInputElement,
		value => {
			game.setTurnTime = value;
			game.setTurnTimeCompare = value;
		}
	);

	bindNumericInputs(
		page.qs("params.minHeartsInput") as HTMLInputElement,
		page.qs("params.minHeartsRange") as HTMLInputElement,
		value => (game.setMinHeart = value)
	);

	bindNumericInputs(
		page.qs("params.maxHeartsInput") as HTMLInputElement,
		page.qs("params.maxHeartsRange") as HTMLInputElement,
		value => (game.setMaxHeart = value)
	);

	bindNumericInputs(
		page.qs("params.botsInput") as HTMLInputElement,
		page.qs("params.botsRange") as HTMLInputElement,
		value => (game.setBot = value)
	);
}

export { modesConfig };
