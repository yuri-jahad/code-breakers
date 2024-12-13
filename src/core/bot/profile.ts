import type { ProfileStats } from "@/types/profile/type";

class BotProfile {
	private static instance: BotProfile | null = null;
	private pseudo: string = "Bot ";
	public static getInstance(): BotProfile {
		if (!BotProfile.instance) {
			BotProfile.instance = new BotProfile();
		}
		return BotProfile.instance;
	}

	public create(id: number): ProfileStats {
		return {
			id,
			avatar: "/public/images/headon.jpg",
			name: this.pseudo + id.toString(),
			heart: 3,
			correctWord: 0,
			status: "alive",
			failWord: 0,
			speed: {
				start: 0,
				end: 0,
			},
		};
	}
}

export default BotProfile.getInstance();
