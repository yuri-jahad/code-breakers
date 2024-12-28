import {
  IntervalId,
  IntervalType,
  IntervalValuesType,
  TurnActivePlayer,
  TurnHandler,
} from "@/types/game/turn";
import type { GameTurnInterface } from "@/types/game/turn";
import GameParameters from "@/core/game/parameters";

export interface TurnManagement {
  turnHandler: TurnHandler;
  turnCurrentPlayer: TurnActivePlayer;
  turnTimeCompare: number;
}

export type TurnManagementKeys = keyof TurnManagement;
export type TurnManagementValues<T extends TurnManagementKeys> =
  TurnManagement[T];

export interface TurnManagementOperations {
  get<T extends keyof TurnManagement>(key: T): TurnManagement[T] | undefined;
  set<K extends keyof TurnManagement>(key: K, value: TurnManagement[K]): void;
}
export type PartialTurnManagement = Partial<TurnManagement>;

export type TurnManagementWithOperations = PartialTurnManagement &
  TurnManagementOperations;

export default class GameTurn
  extends GameParameters
  implements GameTurnInterface
{
  private _intervals: Record<IntervalValuesType, IntervalId> = {
    [IntervalType.PLAYER_TURN]: null,
    [IntervalType.WAIT_STATE]: null,
    [IntervalType.NEXT_TURN]: null,
  };

  private _turnManagement: PartialTurnManagement = {};

  constructor() {
    super();
  }

  getTurnManagement = <K extends TurnManagementKeys>(
    key: K
  ): TurnManagementValues<K> | undefined => {
    return this._turnManagement[key];
  };

  setTurnManagement = <K extends TurnManagementKeys>(
    key: K,
    value: TurnManagementValues<K> | undefined
  ): void => {
    this._turnManagement[key] = value;
  };

  get intervals(): Record<IntervalValuesType, IntervalId> {
    return { ...this._intervals };
  }

  public setInterval(type: IntervalValuesType, id: IntervalId): void {
    this.clearInterval(type);
    this._intervals[type] = id;
  }

  public clearInterval(type: IntervalValuesType): void {
    if (this._intervals[type] !== null) {
      window.clearInterval(this._intervals[type]!);
      this._intervals[type] = null;
    }
  }

  public clearAllIntervals(): void {
    Object.values(IntervalType).forEach((type) => {
      this.clearInterval(type);
    });
  }

  public clearPlayer(): void {
    this.setTurnManagement("turnCurrentPlayer", undefined);
  }

  public clearTurnHandler(): void {
    this.setTurnManagement("turnHandler", undefined);
  }

  public cleanup(): void {
    this.clearAllIntervals();
    this.clearPlayer();
    this.clearTurnHandler();
  }

  protected isPlayerTurn(): boolean {
    return this._turnManagement.turnCurrentPlayer?.id === 0;
  }
}
