import "@/index.css";
import { pageLoaderInstance } from "@/pageLoader";
import data from "@/data/loader/loader-data";
import sidebarSwitchSettings from "@/features/sidebar/sidebar-switch-settings";

await pageLoaderInstance.initialize();
console.log(pageLoaderInstance.cache)
sidebarSwitchSettings();

export { data};
