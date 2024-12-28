import type { ProfileStats } from "@/types/profile/type";


export function deleteHeartHTML(id: number) {
  const playerElement = document.querySelector(`[data-id="${id}"]`);
  if (!playerElement) return;

  const container = playerElement.querySelector(".hearts-container");
  if (!container) return;

  const hearts = container.querySelectorAll(".player-heart");
  const lastHeart = hearts[hearts.length - 1];
  
  if (lastHeart) {
    lastHeart.classList.add('opacity-0', 'scale-0');
    setTimeout(() => {
      lastHeart.remove();
    }, 200);
  }
}

export function removeLife(currentPlayer: ProfileStats) {
  if (currentPlayer && currentPlayer.heart > 0) {
    currentPlayer.heart -= 1;
    deleteHeartHTML(currentPlayer.id || 0);
    
    if (currentPlayer.heart === 0) {
      return true;
    }
  }
  return false;
}