// factory.ts
import type {
  Modes,
  ModesNames,
  ModeCodeHttpType,
  ModeEnglishType,
} from "@/types/game/modes";
import type { GameModeInterface } from "@/core/game/modes";
import type { PuzzleType } from "@/types/data-type";

import datas from "@/data/loader/loader-data";
import EnglishGame from "@/modes/english";
import HttpCodeGame from "@/modes/http";

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
