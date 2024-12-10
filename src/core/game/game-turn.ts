import {
  IntervalId,
  IntervalType,
  IntervalValuesType,
  TurnActivePlayer,
  TurnHandler,
} from "@/types/game/game.turn.type";
import type { GameTurnInterface } from "@/types/game/game.turn.type";
import GameParameters from "@/core/game/game-parameters";


export default class GameTurn extends GameParameters implements GameTurnInterface {
  // Propriétés privées
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

  // Getters publics
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

  // Méthodes de gestion des intervalles
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

  // Méthodes de gestion du joueur
  public setActivePlayer(player: TurnActivePlayer): void {
    this._turnCurrentPlayer = { ...player };
  }

  public clearPlayer(): void {
    this._turnCurrentPlayer = null;
  }

  // Méthodes de gestion du handler
  public setTurnHandler(handler: TurnHandler): void {
    this._turnHandler = handler;
  }

  public clearTurnHandler(): void {
    this._turnHandler = null;
  }

  // Méthode de nettoyage général
  public cleanup(): void {
    this.clearAllIntervals();
    this.clearPlayer();
    this.clearTurnHandler();
  }

  // Méthodes protégées pour l'héritage
  protected getCurrentTurn(): number {
    return this._turnCurrentPlayer?.turnCount ?? 0;
  }

  protected isPlayerTurn(): boolean {
    return this._turnCurrentPlayer?.id === 0;
  }
}
