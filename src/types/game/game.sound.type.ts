export type SoundEffectType = "puzzleSolved" | "puzzleFailed" | "gameJoin";
export type SoundCollection = Record<SoundEffectType, HTMLAudioElement>;
export interface SoundController {
	playSound: (effect: SoundEffectType, volume?: number) => void;
	pauseSound: (effect: SoundEffectType) => void;
}
