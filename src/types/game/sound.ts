export type SoundEffectType =
  | "puzzleSolved"
  | "selfTurn"
  | "puzzleFailed"
  | "gameJoined"
  | "puzzleHeartWin"
  | "puzzleHeartFailed"
  | "countend"
  | "countdown";
export type SoundCollection = Record<SoundEffectType, HTMLAudioElement>;
export interface SoundController {
  playSound: (effect: SoundEffectType, volume?: number) => void;
  pauseSound: (effect: SoundEffectType) => void;
}
