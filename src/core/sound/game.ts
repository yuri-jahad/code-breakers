import type { SoundController, SoundEffectType, SoundCollection } from "@/types/game/sound";

export default class GameSound implements SoundController {
	private sounds: SoundCollection;

	constructor() {
		this.sounds = {
			puzzleSolved: new Audio("/public/sounds/game/solved.wav"),
			puzzleFailed: new Audio("/public/sounds/game/failed.wav"),
			puzzleHeartWin: new Audio("/public/sounds/game/heart-win.wav"),
			puzzleHeartFailed: new Audio("/public/sounds/game/heart-failed.mp3"),
			gameJoined: new Audio("/public/sounds/game/joined.mp3"),
			gameOut: new Audio("public/sounds/game/out.mp3"),
			selfTurn:new Audio("/public/sounds/game/self-turn.wav"),
			countdown: new Audio("/public/sounds/game/countdown.mp3"),
			milestone: new Audio("/public/sounds/game/milestone.mp3"),
			notif: new Audio("public/sounds/chat/notif.mp3")
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
