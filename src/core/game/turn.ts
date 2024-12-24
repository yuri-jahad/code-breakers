import {
  IntervalId,
  IntervalType,
  IntervalValuesType,
  TurnActivePlayer,
  TurnHandler,
} from "@/types/game/turn";
import type { GameTurnInterface } from "@/types/game/turn";
import GameParameters from "@/core/game/parameters";

export default class GameTurn
  extends GameParameters
  implements GameTurnInterface
{
  private _turnCurrentPlayer: TurnActivePlayer | null = null;
  private _intervals: Record<IntervalValuesType, IntervalId> = {
    [IntervalType.PLAYER_TURN]: null,
    [IntervalType.WAIT_STATE]: null,
    [IntervalType.NEXT_TURN]: null,
  };
  private _turnHandler: TurnHandler | null = null;
  protected _turnTimeCompare: number | null = null;
  constructor() {
    super();
  }

  get turnCurrentPlayer(): TurnActivePlayer | null {
    return this._turnCurrentPlayer ? { ...this._turnCurrentPlayer } : null;
  }

  get intervals(): Record<IntervalValuesType, IntervalId> {
    return { ...this._intervals };
  }

  get turnHandler(): TurnHandler | null {
    return this._turnHandler;
  }

  get turnTimeCompare(): number | null {
    return this._turnTimeCompare;
  }

  set setTurnTimeCompare(value: number | null) {
    this._turnTimeCompare = value;
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

  public setActivePlayer(player: TurnActivePlayer): void {
    this._turnCurrentPlayer = { ...player };
  }

  public clearPlayer(): void {
    this._turnCurrentPlayer = null;
  }

  public setTurnHandler(handler: TurnHandler): void {
    this._turnHandler = handler;
  }

  public clearTurnHandler(): void {
    this._turnHandler = null;
  }

  public cleanup(): void {
    this.clearAllIntervals();
    this.clearPlayer();
    this.clearTurnHandler();
  }

  protected getCurrentTurn(): number {
    return this._turnCurrentPlayer?.turnCount ?? 0;
  }

  protected isPlayerTurn(): boolean {
    return this._turnCurrentPlayer?.id === 0;
  }
}
