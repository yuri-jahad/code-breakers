import getPlayer from "@/features/player/get";

interface PlayerElements {
    player: HTMLElement;
    answer: HTMLElement;
}

export default function extractPlayer(id: number): PlayerElements | null {
    const player = getPlayer(id);
    if (!player) {
        return null;
    }

    const answer = player.querySelector("#player-answer") as HTMLElement;
    if (!answer) {
        return null;
    }

    return { player, answer };
}
