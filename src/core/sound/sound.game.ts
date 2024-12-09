import type {
	SoundController,
	SoundEffectType,
	SoundCollection,
} from "@/types/game/game.sound.type";

export default class GameSound implements SoundController {
	private sounds: SoundCollection;

	constructor() {
		this.sounds = {
			puzzleSolved: new Audio("/public/sounds/correctWord.wav"),
			puzzleFailed: new Audio("/public/sounds/puzzleFailed.mp3"),
			gameJoin: new Audio("/public/sounds/gameJoin.mp3"),
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
