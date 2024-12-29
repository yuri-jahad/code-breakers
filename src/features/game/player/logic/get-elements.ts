interface PlayerElements {
  targetPlayer: HTMLLIElement;
  playerAnswer: HTMLElement;
}

export default function getPlayerElements(id: number): PlayerElements | null {
  const targetPlayer = document.querySelector(
    `[data-id="${id}"]`
  ) as HTMLLIElement | null;
  const playerAnswer = targetPlayer?.querySelector(
    "#player-answer"
  ) as HTMLElement | null;

  if (!targetPlayer || !playerAnswer) return null;

  return { targetPlayer, playerAnswer };
}
