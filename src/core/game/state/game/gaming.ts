import { TurnHandler } from "../../../../types/game/turn";
import CircleManager from "@/utils/draw-circle";
import type { ProfileStats } from "@/types/game/profile-stats";
import { displayTypingSpeed } from "@/features/game/speed/display/display";
import { IntervalType } from "@/types/game/turn";
import stateEnd from "@/core/game/state/game/end";
import { animateTextTyping } from "@/utils/animation-text-typing";
import { pageLoaderInstance as page, qs } from "@/router/page-loader";
import { GameInterface } from "@/types/game/game";
import { displayScore } from "@/features/game/score/display/words";
import { isGameWin } from "@/features/game/state/display/win";
import { removeLife } from "@/features/game/heart/logic/delete";
import { updateScore } from "@/features/game/score/logic/update";
import getPlayerElements from "@/features/game/player/logic/get-elements";
import setupGaming from "./setup";

class TurnManager {
  private gameInstance: GameInterface;
  private currentTurnCount: number;
  private typingStarted: boolean = false;
  private playerId: number | undefined;
  private static BASE_TIME: number = 0;
  private readonly MIN_DEDUCTION = 2;
  private readonly MAX_DEDUCTION = 6;
  private intervalId: number | null = null;

  constructor(gameSetup: any) {
    this.gameInstance = gameSetup.gameInstance;
    this.currentTurnCount = gameSetup.currentTurnCount;
    this.playerId = gameSetup.id;

    TurnManager.BASE_TIME =
      (this.gameInstance.getTurnManagement("turnTimeCompare") as number) - 10;

    this.startTurnAnimation();
  }

  private updateDisplays(time: number) {
    if (time >= 0) {
      (page.qs("infos.turnTime") as HTMLElement).textContent = time.toString();
    }
    this.updateUIElements();
  }

  private updateUIElements() {
    const currentPlayer = this.gameInstance.getCurrentPlayer;
    if (!currentPlayer) return;

    displayScore(currentPlayer);
    this.updatePlayerUI(currentPlayer.id === 0);
  }

  private updatePlayerUI(isHumanPlayer: boolean) {
    const answerSpace = page.qs("game.answerSpace") as HTMLElement;
    const letterCount = page.qs("game.letterCount") as HTMLElement;

    if (isHumanPlayer) {
      answerSpace.classList.remove("hidden");
      letterCount.style.display = "flex";
    } else {
      answerSpace.classList.add("hidden");
      letterCount.style.display = "none";
    }
  }

  private startTurnAnimation() {
    const currentTime =
      ((this.gameInstance.get("turnTime") as number) + 1) * 1000;
    CircleManager.animate({
      duration: currentTime,
      baseColor: "#9333EA",
    });
  }

  private getRandomDeduction(): number {
    return (
      Math.floor(
        Math.random() * (this.MAX_DEDUCTION - this.MIN_DEDUCTION + 1)
      ) + this.MIN_DEDUCTION
    );
  }

  private async handleBotTurn(currentTime: number) {
    if (this.typingStarted) return;

    const playerElements = getPlayerElements(this.playerId as number);
    if (!playerElements) return;

    this.typingStarted = true;
    const result = await this.processBotTyping(currentTime, playerElements);

    if (result === this.gameInstance.puzzle.response) {
      await this.handleCorrectAnswer();
    }
  }

  private async processBotTyping(currentTime: number, playerElements: any) {
    return await animateTextTyping(
      this.gameInstance.puzzle.response || "",
      playerElements.playerAnswer,
      currentTime
    );
  }

  public async handleCorrectAnswer() {
    this.gameInstance.gameSound.playSound("puzzleSolved");
    const currentPlayer = this.gameInstance.getCurrentPlayer;
    if (!currentPlayer) return;

    // Application de la déduction de temps
    const deduction = this.getRandomDeduction();
    const currentTime =
      this.gameInstance.get("turnTime") ?? TurnManager.BASE_TIME;

    // Ne pas descendre en dessous du temps de base
    const nextTime = Math.max(TurnManager.BASE_TIME, currentTime - deduction);

    this.gameInstance.set("turnTime", nextTime);
    console.log({
      tb: TurnManager.BASE_TIME,
      tt: this.gameInstance.get("turnTime"),
      tc: this.gameInstance.getTurnManagement("turnTimeCompare"),
      nextTime,
    });

    this.updatePlayerStats(currentPlayer);

    if (this.checkGameCompletion()) {
      stateEnd(this.gameInstance);
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.gameInstance.nextTurnPlayer();
  }

  private updatePlayerStats(player: ProfileStats) {
    player.speed.end = Date.now();
    displayTypingSpeed(player.speed.end - player.speed.start);
    updateScore(player, "correctWord");
    displayScore(player);
  }

  private checkGameCompletion() {
    return isGameWin(
      this.gameInstance.historique.size,
      this.gameInstance.data?.length || 0
    );
  }

  private handleTimeOut() {
    const currentPlayer = this.gameInstance.getCurrentPlayer;
    if (!currentPlayer) return;
    if (currentPlayer.id === 0) {
      (qs("game.letterCount") as HTMLElement).textContent = "0";
    }
    const isDeath = removeLife(currentPlayer);
    this.gameInstance.gameSound.playSound("puzzleHeartFailed", 0.2);
    updateScore(currentPlayer, "failWord");
    const resetTime = this.gameInstance.getTurnManagement(
      "turnTimeCompare"
    ) as number;

    if (isDeath) {
      // Reset au temps initial si le joueur meurt

      this.handlePlayerDeath(currentPlayer);
      if (this.gameInstance.getPlayers.length === 0) {
        stateEnd(this.gameInstance);
        return;
      }
    }
    this.gameInstance.set("turnTime", resetTime);

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.gameInstance.nextTurnPlayer();
  }

  private handlePlayerDeath(player: ProfileStats) {
    player.status = "death";
    this.gameInstance.setPlayerDeath = [
      ...this.gameInstance.getPlayerDeath,
      player,
    ];
    this.gameInstance.setPlayers = this.gameInstance.getPlayers.filter(
      (p: ProfileStats) => p.id !== player.id
    );
  }

  private initializeTurn() {
    const currentPlayer = this.gameInstance.getCurrentPlayer;
    if (currentPlayer) {
      currentPlayer.speed.start = Date.now();
      this.updateUIElements();
      this.updatePlayerUI(currentPlayer.id === 0);
    }
    this.playerId = currentPlayer?.id;
    this.currentTurnCount++;

    this.startTurnAnimation();
  }

  public handleTurn() {
    this.typingStarted = false;
    this.gameInstance.clearInterval(IntervalType.PLAYER_TURN);

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.initializeTurn();

    this.intervalId = window.setInterval(() => {
      const remainingTime = this.gameInstance.get("turnTime") as number;

      const isBot = this.gameInstance.getCurrentPlayer?.id !== 0;

      if (isBot) {
        this.handleBotTurn(remainingTime);
      } else {
        (qs("game.inputAnswer") as HTMLElement).focus();
      }
      //this.updateDisplays(remainingTime);
      this.gameInstance.set("turnTime", remainingTime - 1);

      if (remainingTime <= 0) {
        this.handleTimeOut();
        return;
      }
    }, 1000);

    this.gameInstance.setInterval(IntervalType.PLAYER_TURN, this.intervalId);
    return this.intervalId;
  }
}

export default function game() {
  const gameSetup = setupGaming();
  const turnManager = new TurnManager(gameSetup);
  const gameInstance = gameSetup.gameInstance;

  // Créer un objet fonction qui implémente TurnHandler
  const handler = () => turnManager.handleTurn();
  handler.handleCorrectAnswer = () => turnManager.handleCorrectAnswer();

  gameInstance.setTurnManagement("turnHandler", handler as TurnHandler);
  turnManager.handleTurn();
}
