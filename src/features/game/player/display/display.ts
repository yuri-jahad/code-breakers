import { ProfileStats } from "@/types/game/profile-stats";

class PlayerDisplay {
  private static calculateSize(totalPlayers: number) {
    const baseSize = Math.min(70, 700 / Math.max(totalPlayers, 4));

    return {
      container: Math.max(baseSize * 2, 120),
      avatar: Math.max(baseSize, 50),
      name: Math.max(baseSize / 3.5, 13),
      answer: Math.max(baseSize / 4, 12),
    };
  }
  private static createHeartIcons(heart: number, isBot: boolean) {
    const maxHearts = 5; // ou le nombre maximum possible de cœurs

    return `
	  <div class="hearts-container flex items-center justify-center gap-[2px]" 
		   style="min-width: ${maxHearts * 16}px; height: 14px">
		${Array(heart)
      .fill(null)
      .map(
        (_, index) => `
		  <div class="player-heart transition-all duration-200">
			<svg 
			  xmlns="http://www.w3.org/2000/svg"
			  class="w-3.5 h-3.5 ${isBot ? "text-gray-400" : "text-violet-400"}"
			  viewBox="0 0 20 20"
			  fill="currentColor"
			>
			  <path 
				fill-rule="evenodd"
				d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
				clip-rule="evenodd"
			  />
			</svg>
		  </div>
		`
      )
      .join("")}
	  </div>
	`;
  }

  static createPlayerElement(
    player: ProfileStats,
    position: { x: number; y: number },
    totalPlayers: number
  ): string {
    const size = this.calculateSize(totalPlayers);
    const isHuman = player.id === 0;
    const isDead = player.status === "death";

    return `
      <div 
        data-id="${player.id}"
        class="player absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
          isDead ? "opacity-75" : ""
        }"
        style="
          left: ${position.x}px;
          top: ${position.y}px;
          width: ${size.container}px;
        "
      >
        <div class="relative flex flex-col items-center">
          <!-- Pseudo -->
          <p class="
            text-center
            font-medium
            truncate
            w-full
            ${isHuman ? "text-white" : "text-gray-300"}
            mb-0.5
          " 
          style="font-size: ${size.name}px">
            ${player.name}
          </p>

          <!-- Hearts -->
          <div class="mb-1.5">
            ${this.createHeartIcons(player.heart, !isHuman)}
          </div>

          <!-- Avatar Container -->
          <div class="
            relative
            rounded-full
            border-2
            ${isHuman ? "border-violet-500/30" : "border-gray-500/20"}
            bg-black/20
            overflow-hidden
            transition-all
            duration-300
          "
          style="
            width: ${size.avatar}px;
            height: ${size.avatar}px;
          ">
            <img 
              src="${player.avatar}"
              alt="${player.name}"
              class="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
            ${
              isDead
                ? `
              <div class="absolute inset-0 bg-black/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd" />
                </svg>
              </div>
            `
                : ""
            }
          </div>

          <!-- Réponse -->
          <div 
            id="player-answer"
            class="
              mt-2
              min-h-[20px]
              w-full
              text-center
              ${isHuman ? "text-violet-200" : "text-gray-300"}
              transition-colors
              duration-300
            "
            style="font-size: ${size.answer}px"
          ></div>
        </div>
      </div>
    `;
  }
}

export default PlayerDisplay;
