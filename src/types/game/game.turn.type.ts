import { ParamsType } from "../../core/game/game.parameters";
import { ProfileStats } from "../profile/profile.type";

export type IntervalId = number | null;
export type TurnHandler = () => void;
export type TurnActivePlayer = ProfileStats & {
  turnCount: number;
};

export const IntervalType = {
  PLAYER_TURN: "player",
  WAIT_STATE: "waiting",
  NEXT_TURN: "next",
} as const;

export type IntervalValuesType = (typeof IntervalType)[keyof typeof IntervalType];

export interface GameTurnInterface extends ParamsType {
  readonly turnCurrentPlayer: TurnActivePlayer | null;
  readonly intervals: Record<IntervalValuesType, IntervalId>;
  readonly turnHandler: TurnHandler | null;
  readonly turnTimeCompare: number | null;

  set setTurnTimeCompare(value: number | null);
  setInterval(type: IntervalValuesType, id: IntervalId): void;
  clearInterval(type: IntervalValuesType): void;
  clearAllIntervals(): void;
  setActivePlayer(activePlayer: TurnActivePlayer): void;
  clearPlayer(): void;
  setTurnHandler(handler: TurnHandler): void;
  clearTurnHandler(): void;
  cleanup(): void;
}
