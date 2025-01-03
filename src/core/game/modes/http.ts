import type { PuzzleType } from "@/types/game/data";
import type { ModeCodeHttpType } from "@/types/game/modes";
import { GameMode } from "@/core/game/modes/modes";

export default class HttpCodeGame extends GameMode<
  ModeCodeHttpType,
  PuzzleType
> {
  constructor(
    items: ModeCodeHttpType[],
    historique: Set<PuzzleType["response"]>
  ) {
    super(items, historique);
    this.generate = this.generate.bind(this);
  }
  generate(): PuzzleType | null {
    for (let i of this.items) {
      const obj = { request: i.message, response: i.code };
      if (!this.modeHistory.has(obj.response)) {
        this.modeHistory.add(obj.response);
        this.targetObject = obj;
        return obj;
      }
    }
    return null;
  }

  add(): PuzzleType | null {
    const code = this.generate();
    if (code) {
      return code;
    }
    return null;
  }

  validate(value: string): boolean {
    return this.targetObject?.response === value;
  }
}
