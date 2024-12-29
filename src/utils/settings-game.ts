import { GameInterface } from "@/types/game/game";
import { ModesNames } from "@/types/game/modes";
import { STATE } from "@/types/game/states";
import { qs } from "@/router/page-loader";

const DEFAULT_VALUES = {
  BOTS: 0,
  TURN_TIME: 10,
  MIN_HEARTS: 3,
  MAX_HEARTS: 10,
  TIME_BONUS: 9,
} as const;

function bindNumericInputs(
  input: HTMLInputElement,
  range: HTMLInputElement,
  setter: (value: number) => void,
  game: GameInterface
) {
  const handleChange = (element: HTMLInputElement) => {
    if (game.state === STATE.GAME) return;
    if (element.value) {
      const value = parseInt(element.value);
      setter(value);
      input.value = range.value = String(value);
    }
  };

  input.addEventListener("change", () => handleChange(input));
  range.addEventListener("change", () => handleChange(range));
}

function initializeGameSettings(game: GameInterface) {
  const modeSelect = qs("params.selectMode") as HTMLSelectElement;
  game.set("mode", modeSelect?.value as ModesNames);
  game.set(
    "bot",
    parseInt(
      (qs("params.botsInput") as HTMLInputElement)?.value ||
        String(DEFAULT_VALUES.BOTS)
    )
  );
  game.set(
    "turnTime",
    parseInt(
      (qs("params.turnTimeInput") as HTMLInputElement)?.value ||
        String(DEFAULT_VALUES.TURN_TIME)
    ) + DEFAULT_VALUES.TIME_BONUS
  );
  console.log(
    game.get("turnTime"),
    (qs("params.turnTimeInput") as HTMLInputElement)?.value
  );
  game.set(
    "minHeart",
    parseInt(
      (qs("params.minHeartsInput") as HTMLInputElement)?.value ||
        String(DEFAULT_VALUES.MIN_HEARTS)
    )
  );

  game.set(
    "maxHeart",
    parseInt(
      (qs("params.maxHeartsInput") as HTMLInputElement)?.value ||
        String(DEFAULT_VALUES.MAX_HEARTS)
    )
  );

  game.setTurnManagement("turnTimeCompare", game.get("turnTime") || 19);

  game.initializeFactory(modeSelect?.value as ModesNames);
}

function setupEventListeners(game: GameInterface) {
  const modeSelect = qs("params.selectMode") as HTMLSelectElement;
  modeSelect?.addEventListener("change", () => {
    if (game.state === STATE.GAME) return;
    game.initializeFactory(modeSelect.value as ModesNames);
  });

  bindNumericInputs(
    qs("params.turnTimeInput") as HTMLInputElement,
    qs("params.turnTimeRange") as HTMLInputElement,
    (value) => {
      game.set("turnTime", value + DEFAULT_VALUES.TIME_BONUS);
      game.setTurnManagement(
        "turnTimeCompare",
        value + DEFAULT_VALUES.TIME_BONUS
      );
    },
    game
  );

  bindNumericInputs(
    qs("params.minHeartsInput") as HTMLInputElement,
    qs("params.minHeartsRange") as HTMLInputElement,
    (value) => game.set("minHeart", value),
    game
  );

  bindNumericInputs(
    qs("params.maxHeartsInput") as HTMLInputElement,
    qs("params.maxHeartsRange") as HTMLInputElement,
    (value) => game.set("maxHeart", value),
    game
  );

  bindNumericInputs(
    qs("params.botsInput") as HTMLInputElement,
    qs("params.botsRange") as HTMLInputElement,
    (value) => game.set("bot", value),
    game
  );
}

export default function gameSettings(game: GameInterface) {
  initializeGameSettings(game);
  setupEventListeners(game);
}
