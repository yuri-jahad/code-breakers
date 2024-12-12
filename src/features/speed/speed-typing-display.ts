import { pageLoaderInstance as page } from "@/pageLoader";
export const displayTypingSpeed = (speed: number) => {
	page.makeText(page.qs("infos.infosTypingSpeed") as HTMLElement, speed + "ms");
};
  