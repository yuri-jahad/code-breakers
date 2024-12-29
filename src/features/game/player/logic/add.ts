import CircleManager from "@/utils/draw-circle";
import { PlayersInterface } from "@/core/game/player/game";
import { circle } from "@/utils/circle";
import Players from "@/core/game/player/game";
import UserProfile from "@/core/user/profile";
import BotProfile from "@/core/game/bot/profile";
import playerView from '@/features/game/player/display/display';
import { pageLoaderInstance as page } from "@/router/page-loader";
import { qs } from "@/router/page-loader";

export const addPlayers = (count: number) => {
  const calculateResponsiveRadius = (): number => {
    const viewportWidth = Math.min(
      window.innerWidth,
      document.documentElement.clientWidth
    );

    const viewportHeight = Math.min(
      window.innerHeight,
      document.documentElement.clientHeight
    );
    const minDimension = Math.min(viewportWidth, viewportHeight);

    let baseRadius: number;
    if (viewportWidth < 640) {
      baseRadius = Math.min(minDimension * 0.25, 180);
    } else if (viewportWidth < 1024) {
      baseRadius = Math.min(minDimension * 0.3, 220);
    } else {
      baseRadius = Math.min(minDimension * 0.35, 260);
    }

    return Math.max(baseRadius, baseRadius / Math.sqrt(count));
  };

  let RADIUS = calculateResponsiveRadius();
  const players: PlayersInterface = new Players();
  const containerSize = RADIUS * 2;

  const updateCircle = (size: number) => {
    const canvas = qs("game.activePlayers") as HTMLCanvasElement;
    const circleManager = CircleManager;
    canvas.width = size;
    canvas.height = size;
    (qs("game.players") as HTMLElement).style.width = containerSize + "px";
    (qs("game.players") as HTMLElement).style.height = containerSize + "px";
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      circleManager.initializeContext(ctx, size);
    }
  };
  updateCircle(containerSize);

  // Générer les joueurs et les ajouter directement dans le conteneur principal
  let html = "";
  for (let id = 0; id < count; id++) {
    const { x, y } = circle(RADIUS, id, count);
    const player = id === 0 ? UserProfile.create(id) : BotProfile.create(id);

    players.addPlayer(player);
    html += playerView.createPlayerElement(player, { x, y }, count);
  }

  // Ajouter les joueurs directement dans players-space
  (page.qs("game.players") as HTMLElement).innerHTML = html;

  const handleResize = () => {
    const newRadius = calculateResponsiveRadius();
    if (newRadius !== RADIUS) {
      RADIUS = newRadius;
      const newContainerSize = RADIUS * 2;

      updateCircle(newContainerSize);

      // Mettre à jour la position de chaque joueur
      const playerElements = (
        page.qs("game.playersSpace") as HTMLElement
      ).querySelectorAll(".player");

      playerElements.forEach((playerElement, id) => {
        const { x, y } = circle(RADIUS, id, count);
        (
          playerElement as HTMLElement
        ).style.transform = `translate(${x}px, ${y}px)`;
      });
    }
  };

  let resizeTimeout: NodeJS.Timeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 150);
  });

  return players;
};
