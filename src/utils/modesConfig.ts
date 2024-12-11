// modesConfig.ts
import { STATE } from "@/game";
import { GameInterface } from "@/types/game/game-type";
import { ModesNames } from "@/types/game/game-modes.type";

function modesConfig(game: GameInterface) {
  // Sélection des éléments DOM
  const modeSelect: HTMLSelectElement | null =
    document.querySelector("#mode-select");
  const turnTimeInput: HTMLInputElement | null =
    document.querySelector("#turn-time-input");
  const turnTimeRange: HTMLInputElement | null =
    document.querySelector("#turn-time-range");
  const minHeartInput: HTMLInputElement | null =
    document.querySelector("#min-heart-input");
  const minHeartRange: HTMLInputElement | null =
    document.querySelector("#min-heart-range");
  const maxHeartInput: HTMLInputElement | null =
    document.querySelector("#max-heart-input");
  const maxHeartRange: HTMLInputElement | null =
    document.querySelector("#max-heart-range");
  const botInput: HTMLInputElement | null =
    document.querySelector("#bot-input");
  const botRange: HTMLInputElement | null =
    document.querySelector("#bot-range");

  // Vérification de l'existence des éléments
  if (
    !modeSelect ||
    !turnTimeInput ||
    !turnTimeRange ||
    !minHeartInput ||
    !maxHeartInput ||
    !minHeartRange ||
    !maxHeartRange ||
    !botInput ||
    !botRange
  )
    return;

  // Helper pour lier les inputs numériques et leurs ranges
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
  const selectValue = modeSelect.value as ModesNames;

  game.setMode = selectValue;
  game.setBot = parseInt(botInput.value);
  game.setTurnTime = parseInt(turnTimeInput.value);
  game.setMinHeart = parseInt(minHeartInput.value);
  game.setMaxHeart = parseInt(maxHeartInput.value);
  game.setTurnTimeCompare = game.turnTime;
  turnTimeRange.value = turnTimeRange.value;
  minHeartRange.value = minHeartRange.value;
  maxHeartRange.value = maxHeartRange.value;

  game.initializeFactory(selectValue);

  // Event listener pour le changement de mode
  modeSelect.addEventListener("change", () => {
    if (game.state === STATE.GAME) return;
    console.log(modeSelect.value);
    game.initializeFactory(modeSelect.value as ModesNames);
  });

  // Binding des inputs numériques
  bindNumericInputs(turnTimeInput, turnTimeRange, (value) => {
    game.setTurnTime = value;
    game.setTurnTimeCompare = value;
  });

  bindNumericInputs(
    minHeartInput,
    minHeartRange,
    (value) => (game.setMinHeart = value)
  );

  bindNumericInputs(
    maxHeartInput,
    maxHeartRange,
    (value) => (game.setMaxHeart = value)
  );

  bindNumericInputs(botInput, botRange, (value) => (game.setBot = value));
}

export { modesConfig };
