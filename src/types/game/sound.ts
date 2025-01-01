export type SoundEffectType =
  | "puzzleSolved"
  | "puzzleFailed"
  | "puzzleHeartWin"
  | "puzzleHeartFailed"
  | "gameJoined"
  | "gameOut"
  | "selfTurn"
  | "milestone"
  | "countdown"
  | "notif";

export type SoundCollection = Record<SoundEffectType, HTMLAudioElement>;
export interface SoundController {
  playSound: (effect: SoundEffectType, volume?: number) => void;
  pauseSound: (effect: SoundEffectType) => void;
}
