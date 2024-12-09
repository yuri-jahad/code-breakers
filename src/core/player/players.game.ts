import { ProfileStats } from "@/types/profile/profile.type";

export interface PlayersInterface {
  players: ProfileStats[];
  get getPlayers(): ProfileStats[];
  removePlayer: (id: number) => void;
  addPlayer: (player: ProfileStats) => void;
}

export default class GamePlayers implements PlayersInterface {
  players: ProfileStats[];
  constructor() {
    this.players = [];
  }

  get getPlayers(): ProfileStats[] {
    return this.players;
  }

  removePlayer(id: number) {
    const player = document.querySelector(`[data-id="${id}"]`);
    if (player) {
      player.remove();
      this.players = this.players.filter((player) => player.id !== id);
    }
  }

  addPlayer(player: ProfileStats): void {
    this.players.push(player);
  }
}
