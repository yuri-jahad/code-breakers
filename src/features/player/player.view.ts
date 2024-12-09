import { ProfileStats } from "@/types/profile/profile.type"

export default {
	createHeartIcons(heart: number) {
		let html = "";
		for (let i = 0; i < heart; i++) {
			html += `<div class="player-heart flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-800" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
          </svg>
       </div>`;
		}
		return html;
	},

	createPlayerElement(
		player: ProfileStats,
		position: { x: number; y: number },
		totalPlayers: number
	) {
		const baseSize = Math.min(65, 700 / totalPlayers); 
		const offset = baseSize / 2;

		return `<div data-id="${
			player.id
		}"class="player inline-bloc rounded-lg backdrop-blur-sm absolute" style="left: ${
			position.x - offset
		}px; top: ${position.y - offset}px">
            <div class="flex flex-col gap-0.5 items-center" style="width: ${baseSize}px">
			<p class="font-normal text-bold truncate w-full text-center ${player.id === 0 ? "text-gray-400" : 'text-white'}" 
			   style="font-size: ${baseSize / 4}px">${player.name}</p>
                <div class="container-heart flex items-center" style="transform: scale(${baseSize / 64})">   
                    ${this.createHeartIcons(player.heart)}
                </div>
                <img src="${player.avatar}"
                    alt="${player.name}"
                    style="width: ${baseSize}px; height: ${baseSize}px"
                    class="object-cover rounded-full"/>
                <div class="word text-white" style="font-size: ${baseSize / 5}px"></div>
            </div>
        </div>`;
	},
};
