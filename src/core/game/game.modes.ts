import type { PuzzleType } from "@/types/data.type";

export interface GameModeInterface<T, E> {
  generate: () => E | null;
  add: () => E | null;
  validate: (input: string) => boolean;
  items: T[];
  get targetObject(): E | null;
  set targetObject(target: E);
}

export abstract class GameMode<T, E extends PuzzleType>
  implements GameModeInterface<T, E>
{
  private _targetObject: E | null = null;
  protected modeHistory: Set<E["response"]>;

  constructor(public items: T[], modeHistory: Set<E["response"]>) {
    this.modeHistory = modeHistory;
    this.items = items;
  }

  get targetObject(): E | null {
    return this._targetObject;
  }

  set targetObject(target: E) {
    this._targetObject = target;
  }

  abstract generate(): E | null;
  abstract add(): E | null;
  abstract validate(input: string): boolean;
}
