import { pageLoaderInstance as page } from "@/router/page-loader";
export const displayTypingSpeed = (speed: number) => {
	page.makeText(page.qs("infos.typingSpeed") as HTMLElement, speed + "ms");
};
