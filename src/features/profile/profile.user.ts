import UserStorage from "@/core/user/user.storage";
import UserProfile from "@/core/user/user.profile";

export default async function handleUserRegistration() {
	const avatarElement: HTMLInputElement | null =
		document.querySelector("#avatar");
	const pseudoElement: HTMLInputElement | null =
		document.querySelector("#pseudo");
	const playerAvatar: HTMLImageElement | null =
		document.querySelector("#playerAvatar");
	if (!pseudoElement || !avatarElement || !playerAvatar) return;

	const { avatar, pseudo } = UserStorage.getUserInfo();
	playerAvatar.src = avatar;
	pseudoElement.placeholder = pseudo;

	pseudoElement.addEventListener("keyup", (e: KeyboardEvent) => {
		console.log(pseudoElement.value, "pseudo.value");
		if (e.key === "Enter") {
			if (pseudoElement.value.length > 2) {
				const { avatar } = UserStorage.getUserInfo();
				const userDataStorage = { pseudo: pseudoElement.value, avatar };
				UserStorage.saveUserInfo(userDataStorage);
				UserProfile.setProfile(userDataStorage);
			}
		}
	});

	avatarElement.addEventListener("change", (e: Event) => {
		e.preventDefault();
		if (avatarElement.files && avatarElement.files[0]) {
			const { pseudo } = UserStorage.getUserInfo();
			const reader = new FileReader();
			reader.onload = e => {
				const imageDataUrl = e.target?.result as string;
				console.log(imageDataUrl, "imageDataUrl");
				playerAvatar.src = imageDataUrl;
				UserStorage.saveUserInfo({ pseudo, avatar: imageDataUrl });
			};
			reader.readAsDataURL(avatarElement.files[0]);
		}
	});
}
