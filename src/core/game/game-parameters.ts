import type { ModesNames } from "@/types/game/game-modes.type";

export type ParamsType = {
	minHeart: number | null;
	maxHeart: number | null;

	bot: number | null;
	getBot: number | null;
	setBot: number | null;

	mode: ModesNames | null;
	getMode: ModesNames | null;
	setMode: ModesNames | null;

	turnTime: number | null;
	getTurnTime: number | null;
	setTurnTime: number | null;

	getMinHeart: number | null;
	setMinHeart: number | null;
	getMaxHeart: number | null;
	setMaxHeart: number | null;
};

export default class GameParameters implements ParamsType {
	mode: ModesNames | null = null;
	turnTime: number | null = null;
	minHeart: number | null = null;
	maxHeart: number | null = null;
	bot: number | null = null;
	waitingCount: number = 5;

	get getMode() {
		return this.mode;
	}

	set setMode(value: ModesNames | null) {
		this.mode = value;
	}

	get getTurnTime() {
		return this.turnTime;
	}

	set setTurnTime(value: number | null) {
		this.turnTime = value;
	}

	get getMinHeart() {
		return this.minHeart;
	}

	set setMinHeart(value: number | null) {
		this.minHeart = value;
	}

	get getWaitingCount() {
		return this.waitingCount;
	}

	set setWaitingCount(value: number) {
		this.waitingCount = value;
	}

	get getMaxHeart() {
		return this.maxHeart;
	}

	set setMaxHeart(value: number | null) {
		this.maxHeart = value;
	}
	get getBot() {
		console.log(this.bot, "hihi");
		return this.bot;
	}

	set setBot(value: number | null) {
		this.bot = value;
	}
}
