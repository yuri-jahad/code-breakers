import type { ProfileStats } from "@/types/game/profile-stats";

export const updateScore = <T extends keyof ProfileStats>(
    currentPlayer: ProfileStats,
    prop: T
  ) => {
    const score = currentPlayer[prop];
    if (typeof score === "number") {
      currentPlayer[prop] = (score + 1) as ProfileStats[T];
    } else {
      throw new Error(
        `La propriété ${prop.toString()} n'est pas un score numérique valide`
      );
    }
  };
  