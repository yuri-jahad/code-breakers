import UserStorage from "@/core/user/user.storage";
import type { ProfileStats } from "@/types/profile/profile.type";

class UserProfile {
	private static instance: UserProfile | null = null;
	private _pseudo: string;
	private _avatar: string;

	private constructor() {
		const { avatar, pseudo } = UserStorage.getUserInfo();
		this._pseudo = pseudo;
		this._avatar = avatar;
	}

	public static getInstance(): UserProfile {
		if (!UserProfile.instance) {
			UserProfile.instance = new UserProfile();
		}
		return UserProfile.instance;
	}

	public setProfile(userInfo: { pseudo: string; avatar: string }): void {
		this._pseudo = userInfo.pseudo;
		this._avatar = userInfo.avatar;
	}

	public create(id: number): ProfileStats {
		return {
			id,
			avatar: this._avatar,
			name: this._pseudo,
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

export default UserProfile.getInstance();
