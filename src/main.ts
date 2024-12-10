import "@/index.css";
import data from "@/data/loader/loader-data";
import { PageLoader } from "@/pageLoader";

const pageLoader = PageLoader.getInstance();
const selectors = await pageLoader.initialize();

export { data, selectors };
