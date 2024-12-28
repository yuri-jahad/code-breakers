import type { PuzzleType } from "@/types/data-type";
import type { ModesNames } from "@/types/game/modes";
import type { GameTurnInterface } from "@/types/game/turn";
import type { SoundController } from "./sound";
import { ProfileStats } from "@/types/profile/type";

export type GameState = "inactive" | "start" | "waiting" | "game" | "end";

export interface GameInterface extends GameTurnInterface {
  puzzleGenerate: (() => PuzzleType | null) | null;
  addPlayersHTML: (number: number) => void;
  initializeFactory(mode: ModesNames): PuzzleType | null;
  nextTurnPlayer: () => void;
  timerInterval: number | null;
  state: GameState;
  data: null | any[];
  historique: Set<any>;
  set players(players: ProfileStats[]);
  get players(): ProfileStats[];
  setPuzzle(puzzle: PuzzleType): void;
  waitingCount: number;
  getWaitingCount: number;
  gameSound: SoundController;
  puzzle: PuzzleType;
  set setPlayers(players: ProfileStats[]);
  get getPlayers(): ProfileStats[];

  get getCurrentPlayer(): ProfileStats | null;
  set setCurrentPlayer(player: ProfileStats | null);

  get getPlayerDeath(): ProfileStats[];
  set setPlayerDeath(players: ProfileStats[])
  currentPlayerIndex: number;
  set setCurrentPlayerIndex(index: number);
  get getCurrentPlayerIndex(): number;

  getPlayers: ProfileStats[];
}
