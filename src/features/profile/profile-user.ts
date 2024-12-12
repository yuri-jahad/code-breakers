import UserStorage from "@/core/user/user.storage";
import UserProfile from "@/core/user/user.profile";
import { pageLoaderInstance as page } from "@/pageLoader";

export default async function handleUserRegistration() {
	const { avatar, pseudo } = UserStorage.getUserInfo();

	page.setAttribute(page.qs("user.userAvatar") as HTMLElement, "src", avatar);
	page.setAttribute(page.qs("user.userPseudo") as HTMLElement, "placeholder", pseudo);

	(page.qs("user.userPseudo") as HTMLInputElement).addEventListener("keyup", (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			if ((page.qs("user.userPseudo") as HTMLInputElement).value.length > 2) {
				const { avatar } = UserStorage.getUserInfo();
				const userDataStorage = { pseudo: (page.qs("user.userPseudo") as HTMLInputElement).value, avatar };
				UserStorage.saveUserInfo(userDataStorage);
				UserProfile.setProfile(userDataStorage);
			}
		}
	});

	(page.qs("user.userSelectAvatar") as HTMLInputElement).addEventListener("change", (e: Event) => {
		e.preventDefault();

		const fileInput = page.qs("user.userSelectAvatar") as HTMLInputElement;
		const file = fileInput.files?.[0];

		if (file) {
			const { pseudo } = UserStorage.getUserInfo();
			const reader = new FileReader();

			reader.onload = e => {
				const imageDataUrl = e.target?.result as string;
				console.log(imageDataUrl, "imageDataUrl");

				page.setAttribute(page.qs("user.userAvatar") as HTMLElement, "src", imageDataUrl);

				const userInfo = { pseudo, avatar: imageDataUrl };
				UserStorage.saveUserInfo(userInfo);
				UserProfile.setProfile(userInfo);
			};

			reader.readAsDataURL(file);
		}
	});
}
