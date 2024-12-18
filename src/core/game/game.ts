import type { GameInterface, GameState } from "@/types/game/game";
import type { PuzzleType } from "@/types/data-type";
import type { ProfileStats } from "@/types/profile/type";
import type { ModesNames } from "@/types/game/modes";
import type { SoundController } from "@/types/game/sound";
import Turn from "@/core/game/turn";
import { IntervalType } from "@/types/game/turn";
import { GameFactoryInterface } from "@/modes/factory";
import GameSound from "../sound/game";
import { circle } from "@/utils/circle";
import playerView from "@/features/player/view";
import { pageLoaderInstance as page } from "@/page-loader";

export class Game extends Turn implements GameInterface {
	state: GameState;
	private _players: ProfileStats[];
	public currentPlayer: ProfileStats | null = null;
	public waitingCount: number = 5;
	public gameFactory: null | GameFactoryInterface;
	public currentPlayerIndex: number = 0;
	public playerDeath: ProfileStats[] = [];
	public historique: Set<any>;
	public puzzle: PuzzleType;
	public puzzleGenerate: (() => PuzzleType | null) | null;
	public timer: number;
	public timerInterval: number | null = null;
	public data: null | any[];
	public gameSound: SoundController;

	constructor(gameFactory: GameFactoryInterface) {
		super();
		this.state = "inactive";
		this._players = [];
		this.playerDeath = [];
		this.currentPlayer = null;
		this.gameFactory = gameFactory;
		this.timer = Date.now();
		this.data = null;
		this.gameSound = new GameSound();
		this.puzzle = {
			request: null,
			response: null,
		};
		this.puzzleGenerate = null;
		this.currentPlayerIndex = 0;
		this.historique = new Set();
	}

	addPlayersHTML(radius: number) {
		this._players.forEach((player, index) => {
			if (this.getMinHeart) {
				const { x, y } = circle(radius, index, this._players.length);
				page.makeHTML(
					page.qs("game.activePlayers") as HTMLElement,
					playerView.createPlayerElement(player, { x, y }, this._players.length)
				);
			}
		});
	}
	/**
	 * Initialise le mode de jeu
	 */
	public initializeFactory(mode: ModesNames): PuzzleType | null {
		if (this.gameFactory) {
			this.setMode = mode;
			this.setCurrentPlayer = this._players[0];
			const generate = this.gameFactory.create(mode, this.historique)?.generate;

			if (generate) {
				this.puzzleGenerate = generate;
				this.setPuzzle();
				this.puzzle;
			}
		}
		return null;
	}

	public setPuzzle(): void {
		if (!this.puzzleGenerate) return;
		const entity = this.puzzleGenerate();
		if (!entity) return;
		this.puzzle = entity;
	}

	nextTurnPlayer() {
		this.setTurnTime = this.turnTimeCompare;
		this.clearInterval(IntervalType.PLAYER_TURN);

		const currentIndex = this._players.findIndex(p => p.id === this.currentPlayer?.id);
		this.setPuzzle();

		page.makeText(page.qs("game.currentPuzzle") as HTMLElement, this.puzzle?.request || "");
		const nextIndex = (currentIndex + 1) % this._players.length;

		this._players.find(player => nextIndex === player.id);
		this.setCurrentPlayer = this._players[nextIndex] || this._players[0];
		this.setCurrentPlayerIndex = nextIndex;

		const turnHandler = this.turnHandler;
		if (turnHandler) turnHandler();
		(page.qs("game.inputAnswer") as HTMLInputElement).value = "";
		(page.qs("game.inputAnswer") as HTMLInputElement).hidden = this.players[nextIndex].id > 0;
	}

	get getPlayerDeath(): ProfileStats[] {
		return this.playerDeath;
	}

	set setPlayerDeath(players: ProfileStats[]) {
		this.playerDeath = players;
	}

	set setCurrentPlayerIndex(index: number) {
		this.currentPlayerIndex = index;
	}

	get getCurrentPlayerIndex() {
		return this.currentPlayerIndex;
	}

	set setCurrentPlayer(player: ProfileStats) {
		this.currentPlayer = player;
	}

	get getCurrentPlayer() {
		return this.currentPlayer;
	}

	get players(): ProfileStats[] {
		return this._players;
	}

	set players(players: ProfileStats[]) {
		this._players = players;
	}

	get getPlayers() {
		return this._players;
	}

	set setPlayers(players: ProfileStats[]) {
		this._players = players;
	}

	get getWaitingCount() {
		return this.waitingCount;
	}
}
