import type { ModesNames } from "@/types/game/modes";
export interface GameParams {
  mode: ModesNames;
  turnTime: number;
  minHeart: number;
  maxHeart: number;
  bot: number;
  waitingCount: number;
}

export type PartialGameParams = Partial<GameParams>;

export interface GameParamsOperations {
  get<K extends keyof GameParams>(key: K): GameParams[K] | undefined;
  set<K extends keyof GameParams>(key: K, value: GameParams[K]): void;
}

export type GameParamsWithOperations = PartialGameParams & GameParamsOperations;

type ParamKey = keyof GameParams;
type ParamValue<K extends ParamKey> = GameParams[K];

export default class GameParameters {
  private params: PartialGameParams = {
    waitingCount: 5,
  };

  get = <K extends ParamKey>(key: K): ParamValue<K> | undefined => {
    return this.params[key];
  };

  set = <K extends ParamKey>(key: K, value: ParamValue<K>): void => {
    this.params[key] = value;
  };
}
