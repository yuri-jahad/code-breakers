import type { GameInterface, GameState } from "@/types/game/game";
import type { PuzzleType } from "@/types/data-type";
import type { ProfileStats } from "@/types/profile/type";
import type { ModesNames } from "@/types/game/modes";
import type { SoundController } from "@/types/game/sound";
import Turn from "@/core/game/turn";
import { IntervalType } from "@/types/game/turn";
import { GameFactory, GameFactoryInterface } from "@/modes/factory";
import GameSound from "../sound/game";
import { circle } from "@/utils/circle";
import playerView from "@/features/player/display";
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
  public static instance: Game | null = null;

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

  public static getInstance(gameFactory?: GameFactoryInterface): Game {
    if (!Game.instance) {
      if (!gameFactory) {
        gameFactory = new GameFactory();
      }
      Game.instance = new Game(gameFactory);
    }
    return Game.instance;
  }

  addPlayersHTML(radius: number): void {
    this._players.forEach((player, index) => {
      if (this.get("minHeart")) {
        const { x, y } = circle(radius, index, this._players.length);
        page.makeHTML(
          page.qs("game.activePlayers") as HTMLElement,
          playerView.createPlayerElement(player, { x, y }, this._players.length)
        );
      }
    });
  }

  public initializeFactory(mode: ModesNames): PuzzleType | null {
    if (this.gameFactory) {
      this.set("mode", mode);
      this.setCurrentPlayer = this._players[0];
      const generate = this.gameFactory.create(mode, this.historique)?.generate;

      if (generate) {
        this.puzzleGenerate = generate;
        this.setPuzzle();
        return this.puzzle;
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

  nextTurnPlayer(): void {
    this.clearInterval(IntervalType.PLAYER_TURN);

    const currentIndex = this._players.findIndex(
      (p) => p.id === this.currentPlayer?.id
    );

    this.setPuzzle();
    page.makeText(
      page.qs("game.currentPuzzle") as HTMLElement,
      this.puzzle?.request || ""
    );

    const nextIndex = (currentIndex + 1) % this._players.length;
    this.setCurrentPlayer = this._players[nextIndex] || this._players[0];
    this.setCurrentPlayerIndex = nextIndex;

    this.resetInput(nextIndex);
    const turnHandler = this.getTurnManagement("turnHandler");
    if (turnHandler) turnHandler();
  }

  private resetInput(playerIndex: number): void {
    const inputElement = page.qs("game.inputAnswer") as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
      inputElement.hidden = this.players[playerIndex].id > 0;
    }
  }

  // Getters et Setters
  get getPlayerDeath(): ProfileStats[] {
    return this.playerDeath;
  }

  set setPlayerDeath(players: ProfileStats[]) {
    this.playerDeath = players;
  }

  set setCurrentPlayerIndex(index: number) {
    this.currentPlayerIndex = index;
  }

  get getCurrentPlayerIndex(): number {
    return this.currentPlayerIndex;
  }

  set setCurrentPlayer(player: ProfileStats) {
    this.currentPlayer = player;
  }

  get getCurrentPlayer(): ProfileStats | null {
    return this.currentPlayer;
  }

  get players(): ProfileStats[] {
    return this._players;
  }

  set players(players: ProfileStats[]) {
    this._players = players;
  }

  get getPlayers(): ProfileStats[] {
    return this._players;
  }

  set setPlayers(players: ProfileStats[]) {
    this._players = players;
  }

  get getWaitingCount(): number {
    return this.waitingCount;
  }
}
