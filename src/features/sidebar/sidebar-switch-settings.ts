export default function sidebarSwitchSettings() {
	const selectEffect = ["bg-purple-500/10", "text-purple-400"];
	const elements = {
		paramsBtn: document.querySelector(".sidebar-params-btn"),
		chatBtn: document.querySelector(".sidebar-chat-btn"),
		params: document.querySelector(".sidebar-params"),
		chat: document.querySelector(".sidebar-chat"),
	}
    
	if (!Object.values(elements).every((element) => element)) return;

	elements.paramsBtn?.addEventListener("click", () => {
		if (!elements.chat?.classList.contains("hidden")) {
			elements.chat?.classList.add("hidden");
			elements.params?.classList.remove("hidden");
			elements.chatBtn?.classList.remove(...selectEffect);
			elements.paramsBtn?.classList.add(...selectEffect);
		}
	});

	elements.chatBtn?.addEventListener("click", () => {
		if (!elements.params?.classList.contains("hidden")) {
			elements.params?.classList.add("hidden");
			elements.chat?.classList.remove("hidden");
			elements.paramsBtn?.classList.remove(...selectEffect);
			elements.chatBtn?.classList.add(...selectEffect);
		}
	});
}
