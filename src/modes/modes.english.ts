import type { PuzzleType } from "@/types/data.type";
import type { ModeEnglishType } from "@/types/game/game.modes.type";
import { GameMode } from "@/core/game/game.modes";

export default class EnglishGame extends GameMode<ModeEnglishType, PuzzleType> {
  constructor(items: ModeEnglishType[], historique: Set<PuzzleType["response"]>) {
    super(items, historique);
    this.generate = this.generate.bind(this);
  }

  generate(): PuzzleType | null {
    for (let i of this.items) {
      const obj = { request: i.en, response: i.fr };
      if (!this.modeHistory.has(obj.response)) {
        this.modeHistory.add(obj.response);
        this.targetObject = obj;
        return obj;
      }
    }
    return null;
  }

  add(): PuzzleType | null {
    const phrase = this.generate();
    if (phrase) {
      return phrase;
    }
    return null;
  }

  validate(value: string): boolean {
    return this.targetObject?.response === value;
  }
}
