/**
 * Représente les informations d'un utilisateur dans l'application
 */
interface UserInfo {
	pseudo: string; // Le pseudonyme de l'utilisateur
	avatar: string; // L'URL ou Data URL de l'avatar
}

/**
 * Gère les informations utilisateur et leur persistance dans le localStorage
 */
class UserStorage {
	private readonly DEFAULT_USER_INFO: Readonly<UserInfo> = {
		pseudo: "Anonyme",
		avatar: "/images/default.png",
	} as const;

	private readonly STORAGE_KEY = "bp-client";
	private static instanceStorage: UserStorage | null = null;

	/**
	 * Récupère les informations utilisateur depuis le localStorage
	 * Retourne les valeurs par défaut si aucune donnée n'est trouvée ou en cas d'erreur
	 */
	public static getInstance(): UserStorage {
		if (!UserStorage.instanceStorage) {
			UserStorage.instanceStorage = new UserStorage();
		}
		return UserStorage.instanceStorage;
	}

	public getUserInfo(): UserInfo {
		try {
			const storedData = localStorage.getItem(this.STORAGE_KEY);

			if (!storedData) {
				return this.DEFAULT_USER_INFO;
			}

			const userInfo: UserInfo = JSON.parse(storedData);

			if (!this.isValidUserInfo(userInfo)) {
				console.warn("Invalid user data found in localStorage");
				return { ...this.DEFAULT_USER_INFO };
			}

			return userInfo;
		} catch (error) {
			console.error("Error reading user data from localStorage:", error);
			return { ...this.DEFAULT_USER_INFO };
		}
	}

	/**
	 * Sauvegarde les informations utilisateur dans le localStorage
	 */
	public saveUserInfo(userInfo: UserInfo): boolean {
		try {
			localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userInfo));
			return true;
		} catch (error) {
			console.error("Error saving user data to localStorage:", error);
			return false;
		}
	}

	/**
	 * Supprime les informations utilisateur du localStorage
	 */
	public clearUserInfo(): boolean {
		try {
			localStorage.removeItem(this.STORAGE_KEY);
			return true;
		} catch (error) {
			console.error("Error clearing user data from localStorage:", error);
			return false;
		}
	}

	/**
	 * Vérifie la validité des données utilisateur
	 */
	private isValidUserInfo(userInfo: any): userInfo is UserInfo {
		return (
			userInfo &&
			typeof userInfo.pseudo === "string" &&
			typeof userInfo.avatar === "string"
		);
	}
}

export default UserStorage.getInstance();
