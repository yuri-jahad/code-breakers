import { pageLoaderInstance as page } from "@/page-loader";
export const displayTypingSpeed = (speed: number) => {
	page.makeText(page.qs("infos.typingSpeed") as HTMLElement, speed + "ms");
};
