import type { SoundController, SoundEffectType, SoundCollection } from "@/types/game/sound";

export default class GameSound implements SoundController {
	private sounds: SoundCollection;

	constructor() {
		this.sounds = {
			puzzleSolved: new Audio("/public/sounds/puzzle-solved.wav"),
			puzzleFailed: new Audio("/public/sounds/puzzle-failed.wav"),
			puzzleHeartWin: new Audio("/public/sounds/puzzle-heart-win.wav"),
			puzzleHeartFailed: new Audio("/public/sounds/puzzle-heart-failed.wav"),
			gameJoined: new Audio("/public/sounds/puzzle-joined.mp3"),
		};
	}

	playSound(effect: SoundEffectType, volume: number = 0.2) {
		const sound = this.sounds[effect];
		sound.volume = volume;
		sound.play();
	}

	pauseSound(effect: SoundEffectType) {
		const sound = this.sounds[effect];
		sound.pause();
	}
}
