import "@/index.css";
import { pageLoaderInstance } from "@/page-loader";
import data from "@/data/loader/loader-data";
import sidebarSwitchSettings from "@/features/sidebar/switch-settings";

await pageLoaderInstance.initialize();

sidebarSwitchSettings();

export { data};
