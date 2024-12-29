import { pageLoaderInstance as page } from "@/router/page-loader";

export default function sidebarSwitchSettings() {
    const selectEffect = ["bg-purple-500/10", "text-purple-400"];
    
    (page.qs("sidebar.paramsBtn") as HTMLElement)?.addEventListener("click", () => {
        // Affiche les paramètres
        (page.qs("sidebar.chatSpace") as HTMLElement)?.classList.add("hidden");
        (page.qs("sidebar.paramsSpace") as HTMLElement)?.classList.remove("hidden");
        
        // Met à jour les styles des boutons
        (page.qs("sidebar.chatBtn") as HTMLElement)?.classList.remove(...selectEffect);
        (page.qs("sidebar.paramsBtn") as HTMLElement)?.classList.add(...selectEffect);
    });
    
    (page.qs("sidebar.chatBtn") as HTMLElement)?.addEventListener("click", () => {
        // Affiche le chat
        (page.qs("sidebar.paramsSpace") as HTMLElement)?.classList.add("hidden");
        (page.qs("sidebar.chatSpace") as HTMLElement)?.classList.remove("hidden");
        
        // Met à jour les styles des boutons
        (page.qs("sidebar.paramsBtn") as HTMLElement)?.classList.remove(...selectEffect);
        (page.qs("sidebar.chatBtn") as HTMLElement)?.classList.add(...selectEffect);
    });
}