export function hideGame() {
    const players: HTMLElement | null = document.querySelector(".players");
    const writeInput: HTMLInputElement | null = document.querySelector("#write");
    if (players && writeInput) {
      writeInput.hidden = true;
      players.innerHTML = "";
  }
}
