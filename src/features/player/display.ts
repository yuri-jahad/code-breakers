import { ProfileStats } from '@/types/profile/type';

class PlayerDisplay {
  private static calculateSize(totalPlayers: number) {
    const baseSize = Math.min(80, 800 / Math.max(totalPlayers, 4));
    
    return {
      avatar: Math.max(baseSize, 55),
      name: Math.max(baseSize / 3.5, 14),
      answer: Math.max(baseSize / 3.8, 13)
    };
  }

  private static createHeartIcons(heart: number, isBot: boolean) {
    return Array(heart).fill(null)
      .map(() => `
        <svg 
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 ${isBot ? "text-gray-400" : "text-violet-400"}"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path 
            fill-rule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clip-rule="evenodd"
          />
        </svg>
      `).join('');
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
        class="player absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isDead ? 'opacity-60 grayscale' : ''}"
        style="
          left: ${position.x}px;
          top: ${position.y}px;
        "
      >
        <div class="
          relative
          flex flex-col items-center
          ${isHuman ? 'scale-110' : 'scale-100'}
        ">
          <!-- Nom du joueur -->
          <p class="
            font-medium
            truncate
            text-center
            mb-0.5
            px-3 py-1
            rounded-full
            bg-black/40
            backdrop-blur-sm
            border
            border-white/5
            shadow-lg
            ${isHuman ? 'text-violet-200' : 'text-gray-300'}
            w-auto
            min-w-[100px]
            max-w-[150px]
          " 
          style="font-size: ${size.name}px">
            ${player.name}
          </p>

          <!-- Conteneur Avatar + Cœurs -->
          <div class="relative">
            <!-- Avatar avec bordure -->
            <div class="relative group">
              <img 
                src="${player.avatar}"
                alt="${player.name}"
                style="
                  width: ${size.avatar}px;
                  height: ${size.avatar}px;
                "
                class="
                  relative
                  z-10
                  rounded-full
                  object-cover
                  border-2
                  ${isHuman ? 'border-violet-500/50' : 'border-gray-500/30'}
                  shadow-lg
                  transform
                  transition-all
                  duration-300
                  group-hover:scale-105
                  ${isHuman ? 'group-hover:border-violet-400' : 'group-hover:border-gray-400/50'}
                "
              />
              
              <!-- Overlay pour joueur mort -->
              ${isDead ? `
                <div class="absolute inset-0 z-20 flex items-center justify-center rounded-full bg-black/40">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              ` : ''}
            </div>

            <!-- Cœurs -->
            <div class="
              absolute
              -bottom-2
              left-1/2
              transform
              -translate-x-1/2
              flex
              items-center
              gap-0.5
              px-2
              py-1
              rounded-full
              bg-black/40
              backdrop-blur-sm
              border
              border-white/5
              shadow-lg
            ">
              ${this.createHeartIcons(player.heart, !isHuman)}
            </div>
          </div>

          <!-- Réponse -->
          <div 
            id="player-answer"
            class="
              mt-4
              px-3
              py-1
              min-h-[25px]
              rounded-full
              text-violet-100
              font-medium
              bg-black/40
              backdrop-blur-sm
              shadow-lg
              border
              border-white/5
              transition-all
              duration-300
              ${!isHuman ? 'text-gray-300' : ''}
            "
            style="font-size: ${size.answer}px"
          ></div>
        </div>
      </div>
    `;
  }
}

export default PlayerDisplay;