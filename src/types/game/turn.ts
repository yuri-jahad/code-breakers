import { TurnManagementKeys, TurnManagementValues } from "@/core/game/turn-management";

import { GameParamsWithOperations } from "@/core/game/parameters";
import { ProfileStats } from "@/types/game/profile-stats";
export type IntervalId = number | null;
export type TurnHandler = {
  (): number;
  handleCorrectAnswer(): Promise<void>;
};
export type TurnActivePlayer = ProfileStats & {
  turnCount: number;
};

export const IntervalType = {
  PLAYER_TURN: "player",
  WAIT_STATE: "waiting",
  NEXT_TURN: "next",
} as const;

export type IntervalValuesType =
  (typeof IntervalType)[keyof typeof IntervalType];

export interface GameTurnInterface extends GameParamsWithOperations {
  getTurnManagement<K extends TurnManagementKeys>(
    key: K
  ): TurnManagementValues<K> | undefined;
  setTurnManagement<K extends TurnManagementKeys>(
    key: K,
    value: TurnManagementValues<K> | undefined
  ): void;
  readonly intervals: Record<IntervalValuesType, IntervalId>;
  setInterval(type: IntervalValuesType, id: IntervalId): void;
  clearInterval(type: IntervalValuesType): void;
  clearAllIntervals(): void;
  clearPlayer(): void;
  clearTurnHandler(): void;
  cleanup(): void;
}
