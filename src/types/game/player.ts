import type { FindEntityType } from "@/types/game/data";

export interface GameMode<T> {
  generate: () => T | null;
  add: () => T | null;
  check: (value: string) => boolean;
  data: T[];
  get getFindEntity(): FindEntityType | null;
  set setFindEntity(findEntity: FindEntityType);
}
