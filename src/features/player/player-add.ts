import { PlayersInterface } from "@/core/player/players-game";
import { GameInterface } from "@/types/game/game.type";
import { circle } from "@/utils/circle";
import Players from "@/core/player/players-game";
import UserProfile from "@/core/user/user.profile";
import BotProfile from "@/core/bot/bot-profile";
import playerView from "@/features/player/player-view";

export const addPlayers = (count: number, game: GameInterface) => {
    const playerselement: HTMLElement | null = document.querySelector(".players");
    if (!playerselement) return;

    // Fonction pour calculer le rayon responsive
    const calculateResponsiveRadius = (): number => {
        const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
        const viewportHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
        const minDimension = Math.min(viewportWidth, viewportHeight);

        // Calcul du rayon de base en fonction de la taille de l'écran
        let baseRadius: number;
        if (viewportWidth < 640) { // Mobile
            baseRadius = Math.min(minDimension * 0.25, 180);
        } else if (viewportWidth < 1024) { // Tablet
            baseRadius = Math.min(minDimension * 0.3, 220);
        } else { // Desktop
            baseRadius = Math.min(minDimension * 0.35, 260);
        }

        // Ajuster le rayon en fonction du nombre de joueurs
        return Math.max(baseRadius, baseRadius / Math.sqrt(count));
    };

    // Initialiser le rayon
    let RADIUS = calculateResponsiveRadius();
    const players: PlayersInterface = new Players();

    // Configuration du conteneur
    const containerSize = RADIUS * 2;
    playerselement.style.width = `${containerSize}px`;
    playerselement.style.height = `${containerSize}px`;
    playerselement.style.borderRadius = "50%";
    playerselement.style.border = "1px solid rgba(147, 51, 234, 0.05)";
    playerselement.style.background = "radial-gradient(circle at center, rgba(147, 51, 234, 0.02) 0%, transparent 70%)";
    playerselement.style.boxShadow = "0 0 20px rgba(147, 51, 234, 0.05)";

    // Générer les joueurs
    let html = "";
    for (let id = 0; id < count; id++) {
        const { x, y } = circle(RADIUS, id, count);
        const player = id === 0 
            ? UserProfile.create(id)
            : BotProfile.create(id);

        players.addPlayer(player);
        html += playerView.createPlayerElement(player, { x, y }, count);
    }

    playerselement.innerHTML = html;

    // Gestionnaire de redimensionnement
    const handleResize = () => {
        const newRadius = calculateResponsiveRadius();
        if (newRadius !== RADIUS) {
            RADIUS = newRadius;
            const newContainerSize = RADIUS * 2;
            playerselement!.style.width = `${newContainerSize}px`;
            playerselement!.style.height = `${newContainerSize}px`;

            // Mettre à jour la position de chaque joueur
            const playerElements = playerselement!.children;
            for (let id = 0; id < playerElements.length; id++) {
                const { x, y } = circle(RADIUS, id, count);
                const playerElement = playerElements[id] as HTMLElement;
                playerElement.style.transform = `translate(${x}px, ${y}px)`;
            }
        }
    };

    // Ajouter le gestionnaire d'événements de redimensionnement avec debounce
    let resizeTimeout: NodeJS.Timeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 150);
    });

    return players;
};