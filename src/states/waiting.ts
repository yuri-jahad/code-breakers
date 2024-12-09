import { stateElement } from './../utils/selector';
import type { GameInterface } from "@/types/game/game.type";

import { STATE } from "@/game";
import { addPlayers } from "@/features/player/player.add";
import { IntervalType } from "@/types/game/game.turn.type";

type WaitingInterval = ReturnType<typeof setInterval>;

interface WaitingElements {
  startAction: HTMLButtonElement;
  stateElement: HTMLElement;
}

export default async function waiting(
  startAction: HTMLButtonElement | null,
  game: GameInterface,
  stateElement: HTMLElement
): Promise<WaitingInterval | null> {
  if (!startAction) return null;

  const elements: WaitingElements = {
    startAction,
    stateElement,
  };

  initializeWaitingState(game, elements);
  return startWaitingCounter(game, elements);
}

function initializeWaitingState(
  game: GameInterface,
  elements: WaitingElements
) {
  const { startAction, stateElement } = elements;
  const rules: HTMLElement | null = document.querySelector(".rules");
  const table: HTMLElement | null = document.querySelector("table");
  const infosPlayer: HTMLElement | null =
    document.querySelector(".infos-player");
    
    console.log({startAction, rules, table, infosPlayer, stateElement});
  if (!rules || !infosPlayer || !rules || !table) return;
  rules.style.display = "none";
  infosPlayer.classList.remove('hidden')
  infosPlayer.classList.add('flex')

  const numberOfPlayers = (game.getBot ?? 0) + 1;
  const players = addPlayers(numberOfPlayers, game);

  if (!players) return null;
  game.setPlayers = players.getPlayers;
  game.state = STATE.WAITING;

  startAction.innerHTML = STATE.CANCEL_WAITING;
  updateWaitingUI(game.getWaitingCount, stateElement);
}

function updateWaitingUI(count: number, stateElement: HTMLElement) {
  stateElement.innerHTML = `La partie va commencer dans ${count} secondes`;
}

async function startWaitingCounter(
  game: GameInterface,
  elements: WaitingElements
): Promise<WaitingInterval | null> {
  let gameWaitingCount = game.getWaitingCount;
  
  return new Promise((resolve) => {
    const interval = window.setInterval(() => {
      updateWaitingUI(gameWaitingCount, elements.stateElement);
      gameWaitingCount--;
      if (gameWaitingCount === -1) {
        resolve(interval as unknown as WaitingInterval);
      }
    }, 1000);

    game.setInterval(IntervalType.WAIT_STATE, interval);
  });
}
