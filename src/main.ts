import "@/index.css";
import data from "@/data/loader/loader-data";
import { PageLoader } from "@/pageLoader";
import sidebarSwitchSettings from "./features/sidebar/sidebar-switch-settings";

const pageLoader = PageLoader.getInstance();
const selectors = await pageLoader.initialize();
sidebarSwitchSettings()

export { data, selectors };
