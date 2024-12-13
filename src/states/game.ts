import type { GameInterface } from "@/types/game/game";
import type { ProfileStats } from "@/types/profile/type";
import { IntervalType } from "@/types/game/turn";
import { STATE } from "@/game";
import { displayScore } from "@/features/score/display";
import { displayTypingSpeed } from "@/features/speed/display-typing";
import { displayTimeGame } from "@/features/time/display";
import { isGameWin } from "@/features/game/win";
import { removeLife } from "@/features/heart/delete";
import stateEnd from "@/states/end";
import { updateScore } from "@/features/score/update";
import { data } from "@/modes/factory";
import { animateTextTyping } from "@/utils/animation-text-typing";
import { pageLoaderInstance as page } from "@/page-loader";
import extractPlayer from "@/features/player/extract";

export default function game(game: GameInterface) {
	const INITIAL_TURN_COUNT = game.turnCurrentPlayer?.turnCount || 0;
	let currentTurnCount = INITIAL_TURN_COUNT;
	let id = null;
	game.data = data || null;
	game.setTurnTimeCompare = game.getTurnTime;

	// Initial UI setup
	page.makeText(page.qs("game.gameCurrentState") as HTMLElement, "IN GAME");
	page.setAttribute(page.qs("sidebar.paramsSpace") as HTMLElement, "display", "none");

	const start = Date.now();
	game.state = STATE.GAME;
	game.timerInterval = window.setInterval(() => displayTimeGame(start), 1000);

	// Function to handle player's turn time
	const handleTurnTime = () => {
		let typingStarted = false;
		game.clearInterval(IntervalType.PLAYER_TURN);
		//page.setAttribute(page.qs("game.gameInputAnswer") as HTMLInputElement, "hidden", "false");
		const interval = window.setInterval(async () => {
			const currentTime = game.getTurnTime;

			updateTimerDisplay(currentTime || 0);

			// quand le temps est le même
			if (game.turnTimeCompare === currentTime) {
				if (game.getCurrentPlayer) {
					game.getCurrentPlayer.speed.start = Date.now();
					displayScore(game.getCurrentPlayer);
				}

				const currentPlayer = game.players[game.currentPlayerIndex];
				if (currentPlayer) {
					const isPlayer = currentPlayer.id === 0;

					if (isPlayer) {
						(page.qs("game.answerSpace") as HTMLElement).classList.remove("hidden");
					} else {
						(page.qs("game.letterCount") as HTMLElement).style.display = "none";
					}
				}
				//game.setCurrentPlayer = players[game.currentPlayerIndex];
				console.log(game.currentPlayerIndex, game);
				const isNotPlayer = game.getCurrentPlayer && game.getCurrentPlayer.id !== 0;

				id = game.getCurrentPlayer?.id;

				// incrémenter le compteur de tour
				currentTurnCount++;

				// si le joueur n'est pas le bot
				if (isNotPlayer && id) {
					const playerExtract = extractPlayer(id);
					if (!playerExtract) return;
					// récupérer l'élément de la phrase à écrire

					if (!typingStarted) {
						typingStarted = true;
						// vérifier si la phrase est écrite correctement
						const result = await animateTextTyping(game.puzzle.response || "", playerExtract.answer, currentTime || 5);

						if (result === game.puzzle.response) {
							game.gameSound.playSound("puzzleSolved");

							(page.qs("game.activePlayers") as HTMLElement).classList.add("border border-green-500");
							setTimeout(() => {
								(page.qs("game.activePlayers") as HTMLElement).classList.remove("border border-green-500");
							}, 100);

							const currentPlayer = game.getCurrentPlayer;
							if (game.getCurrentPlayer) {
								game.getCurrentPlayer.speed.end = Date.now();
								displayTypingSpeed(game.getCurrentPlayer.speed.end - game.getCurrentPlayer.speed.start);
								const isComplete = isGameWin(game.historique.size, game.data?.length || 0);
								console.log(game.historique.size, game.data?.length || 0);
								if (isComplete) {
									stateEnd(game);
									return;
								}
							}
							if (currentPlayer) {
								updateScore(currentPlayer, "correctWord");
								displayScore(currentPlayer);
							}
							game.nextTurnPlayer();
							return;
						}
					}
				}
			} else if (currentTime === 0) {
				// Gestion de la perte de vie
				if (game.getCurrentPlayer) {
					const isDeath = removeLife(game.getCurrentPlayer);
					if (game.getCurrentPlayer) {
						updateScore(game.getCurrentPlayer, "failWord");
					}
					// si le joueur est mort
					if (isDeath) {
						console.log("Player died:", game.getCurrentPlayer);
						game.getCurrentPlayer.status = "death";
						game.setPlayerDeath = [...game.getPlayerDeath, game.getCurrentPlayer];
						game.setPlayers = game.getPlayers.filter(
							(player: ProfileStats) => player.id !== game?.getCurrentPlayer?.id
						);
						if (game.getPlayers.length === 0) {
							console.log("No players remaining - ending game");
							stateEnd(game);
							return;
						}
					}
					game.nextTurnPlayer();
				}
				handleTurnTime();
			}

			// Décrémenter le temps
			if (currentTime && currentTime > -1) {
				game.setTurnTime = currentTime - 1;
				console.log(game.getPlayers);
			}
		}, 1000);

		game.setInterval(IntervalType.PLAYER_TURN, interval);
		return interval;
	};

	game.setTurnHandler(handleTurnTime);
	handleTurnTime();
}

export const updateTimerDisplay = (currentTime: number) => {
	if (currentTime >= 0) {
		(page.qs("infos.turnTime") as HTMLElement).textContent = currentTime.toString();
	}
};
