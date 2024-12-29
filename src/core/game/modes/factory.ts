// factory.ts
import type {
  Modes,
  ModesNames,
  ModeCodeHttpType,
  ModeEnglishType,
} from "@/types/game/modes";
import type { GameModeInterface } from "@/core/game/modes/modes";
import type { PuzzleType } from "@/types/game/data";

import datas from "@/core/loader/data";
import HttpCodeGame from "@/core/game/modes/http";
import EnglishGame from "@/core/game/modes/english";

export interface GameFactoryInterface {
  create(
    mode: ModesNames,
    historique: Set<PuzzleType["response"]>
  ): GameModeInterface<Modes, PuzzleType> | null;
}
let data: null | any[] = null;

export class GameFactory implements GameFactoryInterface {
  create(
    mode: ModesNames,
    historique: Set<PuzzleType["response"]>
  ): GameModeInterface<Modes, PuzzleType> | null {
    switch (mode) {
      case "code-http":
        data = datas.httpCode as ModeCodeHttpType[];
        return new HttpCodeGame(data, historique);
      case "english":
        data = datas.english as ModeEnglishType[];
        return new EnglishGame(data, historique);
      default:
        return null;
    }
  }
}

export { data };
