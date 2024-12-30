import type { SoundController, SoundEffectType, SoundCollection } from "@/types/game/sound";

export default class GameSound implements SoundController {
	private sounds: SoundCollection;

	constructor() {
		this.sounds = {
			puzzleSolved: new Audio("/public/sounds/solved.wav"),
			puzzleFailed: new Audio("/public/sounds/failed.wav"),
			puzzleHeartWin: new Audio("/public/sounds/heart-win.wav"),
			puzzleHeartFailed: new Audio("/public/sounds/heart-failed.mp3"),
			gameJoined: new Audio("/public/sounds/joined.mp3"),
			selfTurn:new Audio("/public/sounds/self-turn.wav"),
			countdown: new Audio("/public/sounds/countdown.mp3"),
			countend:new Audio("/public/sounds/countend.mp3")
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
