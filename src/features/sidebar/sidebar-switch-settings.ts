import { pageLoaderInstance as page } from "@/pageLoader";

export default function sidebarSwitchSettings() {
    const selectEffect = ["bg-purple-500/10", "text-purple-400"];
    
    (page.qs("sidebar.sidebarParamsBtn") as HTMLElement)?.addEventListener("click", () => {
        // Affiche les paramètres
        (page.qs("sidebar.sidebarChatContainer") as HTMLElement)?.classList.add("hidden");
        (page.qs("sidebar.sidebarParamsContainer") as HTMLElement)?.classList.remove("hidden");
        
        // Met à jour les styles des boutons
        (page.qs("sidebar.sidebarChatBtn") as HTMLElement)?.classList.remove(...selectEffect);
        (page.qs("sidebar.sidebarParamsBtn") as HTMLElement)?.classList.add(...selectEffect);
    });
    
    (page.qs("sidebar.sidebarChatBtn") as HTMLElement)?.addEventListener("click", () => {
        // Affiche le chat
        (page.qs("sidebar.sidebarParamsContainer") as HTMLElement)?.classList.add("hidden");
        (page.qs("sidebar.sidebarChatContainer") as HTMLElement)?.classList.remove("hidden");
        
        // Met à jour les styles des boutons
        (page.qs("sidebar.sidebarParamsBtn") as HTMLElement)?.classList.remove(...selectEffect);
        (page.qs("sidebar.sidebarChatBtn") as HTMLElement)?.classList.add(...selectEffect);
    });
}