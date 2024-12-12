// modesConfig.ts
import { STATE } from "@/game";
import { GameInterface } from "@/types/game/game-type";
import { ModesNames } from "@/types/game/game-modes.type";
import { pageLoaderInstance as page } from "@/pageLoader";
function modesConfig(game: GameInterface) {
	// Sélection des éléments DOM

	// Helper pourlier les inputs numériques et leurs ranges
	const bindNumericInputs = (
		input: HTMLInputElement,
		range: HTMLInputElement,
		setter: (value: number) => void
	) => {
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

	game.setMode = (page.qs("params.paramsSelectMode") as HTMLSelectElement)
		?.value as ModesNames;
	game.setBot = parseInt(
		(page.qs("params.paramsBotInput") as HTMLInputElement)?.value || "0"
	);
	game.setTurnTime = parseInt(
		(page.qs("params.paramsTurnTimeInput") as HTMLInputElement)?.value || "5"
	);
	game.setMinHeart = parseInt(
		(page.qs("params.paramsMinHeartInput") as HTMLInputElement)?.value || "1"
	);
	game.setMaxHeart = parseInt(
		(page.qs("params.paramsMaxHeartInput") as HTMLInputElement)?.value || "10"
	);
	game.setTurnTimeCompare = game.turnTime;

	game.initializeFactory(
		(page.qs("params.paramsSelectMode") as HTMLSelectElement)
			?.value as ModesNames
	);

	// Event listener pour le changement de mode
	(page.qs("params.paramsSelectMode") as HTMLSelectElement)?.addEventListener(
		"change",
		() => {
			if (game.state === STATE.GAME) return;
			game.initializeFactory(
				(page.qs("params.paramsSelectMode") as HTMLSelectElement)
					?.value as ModesNames
			);
		}
	);

	// Binding des inputs numériques
	bindNumericInputs(
		page.qs("params.paramsTurnTimeInput") as HTMLInputElement,
		page.qs("params.paramsTurnTimeRange") as HTMLInputElement,
		value => {
			game.setTurnTime = value;
			game.setTurnTimeCompare = value;
		}
	);

	bindNumericInputs(
		page.qs("params.paramsMinHeartInput") as HTMLInputElement,
		page.qs("params.paramsMinHeartRange") as HTMLInputElement,
		value => (game.setMinHeart = value)
	);

	bindNumericInputs(
		page.qs("params.paramsMaxHeartInput") as HTMLInputElement,
		page.qs("params.paramsMaxHeartRange") as HTMLInputElement,
		value => (game.setMaxHeart = value)
	);

	bindNumericInputs(
		page.qs("params.paramsBotInput") as HTMLInputElement,
		page.qs("params.paramsBotRange") as HTMLInputElement,
		value => (game.setBot = value)
	);
}

export { modesConfig };
