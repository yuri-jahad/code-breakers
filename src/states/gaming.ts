import CircleManager from '@/utils/draw-circle';
import type { ProfileStats } from "@/types/profile/type";
import { IntervalType } from "@/types/game/turn";
import { displayScore } from "@/features/score/display";
import { displayTypingSpeed } from "@/features/speed/typing-display";
import { isGameWin } from "@/features/game/state/display-win";
import { removeLife } from "@/features/heart/delete";
import stateEnd from "@/states/end";
import { updateScore } from "@/features/score/update";
import { animateTextTyping } from "@/utils/animation-text-typing";
import { pageLoaderInstance as page } from "@/page-loader";
import setupGaming from "@/core/state/gaming/setup";
import getPlayerElements from "@/features/player/get-elements";

class TurnManager {
  private gameInstance: any;
  private currentTurnCount: number;
  private typingStarted: boolean = false;
  private playerId: number | undefined;

  constructor(gameSetup: any) {
    this.gameInstance = gameSetup.gameInstance;
    this.currentTurnCount = gameSetup.currentTurnCount;
    this.playerId = gameSetup.id;
  }

  private updateDisplays(currentTime: number) {
    if (currentTime >= 0) {
      (page.qs("infos.turnTime") as HTMLElement).textContent = currentTime.toString();
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
    const maxTime = this.gameInstance.turnTimeCompare || 5;
    CircleManager.animate({ 
      duration: maxTime * 1000,
      baseColor: this.gameInstance.getCurrentPlayer?.color || "#9333EA"
    });
  }

  private async handleBotTurn(currentTime: number) {
    if (this.typingStarted) return;
    
    const playerElements = getPlayerElements(this.playerId || 0);
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
      currentTime || 5
    );
  }

  private async handleCorrectAnswer() {
    this.gameInstance.gameSound.playSound("puzzleSolved");
    
    const currentPlayer = this.gameInstance.getCurrentPlayer;
    if (!currentPlayer) return;

    this.updatePlayerStats(currentPlayer);
    
    if (this.checkGameCompletion()) {
      stateEnd(this.gameInstance);
      return;
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

    const isDeath = removeLife(currentPlayer);
    updateScore(currentPlayer, "failWord");

    if (isDeath) {
      this.handlePlayerDeath(currentPlayer);
      if (this.gameInstance.getPlayers.length === 0) {
        stateEnd(this.gameInstance);
        return;
      }
    }

    this.gameInstance.nextTurnPlayer();
    this.handleTurn();
  }

  private handlePlayerDeath(player: ProfileStats) {
    player.status = "death";
    this.gameInstance.setPlayerDeath = [...this.gameInstance.getPlayerDeath, player];
    this.gameInstance.setPlayers = this.gameInstance.getPlayers.filter(
      (p: ProfileStats) => p.id !== player.id
    );
  }

  private initializeTurn() {
    const currentPlayer = this.gameInstance.getCurrentPlayer;
    if (currentPlayer) {
      currentPlayer.speed.start = Date.now();
      
      // Mettre à jour l'UI au début du tour
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

    // Initialisation immédiate du tour
    this.initializeTurn();

    const interval = window.setInterval(() => {
      const currentTime = this.gameInstance.getTurnTime;
      
      // Gérer le tour du bot
      const isBot = this.gameInstance.getCurrentPlayer?.id !== 0;
      if (currentTime === this.gameInstance.turnTimeCompare && isBot) {
        this.handleBotTurn(currentTime);
      }
      
      // Gérer la fin du temps
      if (currentTime === 0) {
        this.handleTimeOut();
        return;
      }

      // Décrémenter et mettre à jour le temps
      if (currentTime && currentTime > -1) {
        this.gameInstance.setTurnTime = currentTime - 1;
        this.updateDisplays(currentTime - 1);
      }
    }, 1000);

    this.gameInstance.setInterval(IntervalType.PLAYER_TURN, interval);
    return interval;
  }
}

export default function game() {
  const gameSetup = setupGaming();
  const turnManager = new TurnManager(gameSetup);

  const gameInstance = gameSetup.gameInstance;
  gameInstance.setTurnHandler(() => turnManager.handleTurn());
  turnManager.handleTurn();
}