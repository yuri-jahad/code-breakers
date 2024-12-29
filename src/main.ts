import "@/index.css";
import { pageLoaderInstance } from "@/router/page-loader";
import data from "@/core/loader/data";
import sidebarSwitchSettings from "@/features/sidebar/settings/logic/switch-settings";

await pageLoaderInstance.initialize();

sidebarSwitchSettings();

export { data};
