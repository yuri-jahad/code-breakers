export interface SelectorConfig {
	selector: string;
	all?: boolean;
}

// Les sélecteurs avec leurs valeurs
export const selectors = {
	helper: {
		helperRules: { selector: "#helper-rules" },
	},
	user: {
		userAvatar: { selector: "#user-avatar" },
		userSelectAvatar: { selector: "#user-select-avatar" },
		userPseudo: { selector: "#user-pseudo" },
	},
	infos: {
		infosCurrentMode: { selector: "#infos-current-mode" },
		infosCurrentPlayer: { selector: "#infos-current-player" },
		infosTime: { selector: "#infos-time" },
		infosTypingSpeed: { selector: "#infos-typing-speed" },
		infosTurnTime: { selector: "#infos-turn-time" },
	},
	game: {
		gameAnswerContainer: { selector: "#game-answer-container" },
		gameInputAnswer: { selector: "#game-input-answer" },
		gameLetterCount: { selector: "#game-letter-count" },
		gameStartAction: { selector: "#game-start-action" },
		gameCurrentState: { selector: "#game-current-state" },
		gamePlayerContent: { selector: "#game-player-content" },
		gameFindEntity: { selector: "#game-find-entity" },
	},
	sidebar: {
		sidebarContent: { selector: ".sidebar-content" },
		sidebarChatContainer: { selector: "#sidebar-chat-container" },
		sidebarChatMessages: { selector: "#sidebar-chat-messages" },
		sidebarChatInput: { selector: "#sidebar-chat-input" },
		sidebarChatInputContainer: { selector: "#sidebar-chat-input-container" },
		sidebarChatSend: { selector: "#sidebar-chat-send" },
		sidebarParamsContainer: { selector: "#sidebar-params-container" },
		sidebarParamsBtn: { selector: "#sidebar-params-btn" },
		sidebarChat: { selector: "#sidebar-chat" },
		sidebarChatBtn: { selector: "#sidebar-chat-btn" },
	},
	params: {
		paramsSelectMode: { selector: "#params-select-mode" },
		paramsTurnTimeInput: { selector: "#turn-time-input" },
		paramsTurnTimeRange: { selector: "#turn-time-range" },
		paramsMinHeartInput: { selector: "#min-heart-input" },
		paramsMinHeartRange: { selector: "#min-heart-range" },
		paramsMaxHeartInput: { selector: "#max-heart-input" },
		paramsMaxHeartRange: { selector: "#max-heart-range" },
		paramsBotInput: { selector: "#bot-input" },
		paramsBotRange: { selector: "#bot-range" },
	},
} as const;

export interface SelectorRenderType {
	[key: string]: {
		[key: string]: HTMLElement | NodeListOf<HTMLElement> | null;
	};
}

export type BaseSelectorType = {
	[section: string]: {
		[key: string]: SelectorConfig;
	};
};

// Type pour le rendu des sélecteurs
export type SelectorsType = typeof selectors;
export type SelectorsKeysType = keyof SelectorsType;

// Type de base pour tous les rendus de sélecteurs
export interface BaseSelectorRenderType {
	[key: string]: {
		[key: string]: HTMLElement | NodeListOf<HTMLElement> | null;
	};
}

export type SelectorRenderTypeGame = {
	[T in SelectorsKeysType]: {
		[K in AllNestedKeys]: HTMLElement | NodeListOf<HTMLElement> | null;
	};
};

export type AllNestedKeys = {
	[K in SelectorsKeysType]: keyof SelectorsType[K];
}[SelectorsKeysType];

export type ChildSelectorRenderType = Record<AllNestedKeys, HTMLElement | NodeListOf<HTMLElement> | null>;

export type SelectorPath = keyof {
	[K in SelectorsKeysType]: {
		[P in keyof SelectorsType[K] as `${K}.${string & P}`]: any;
	};
}[SelectorsKeysType];

export type SelectorPathAutocomplete<T extends SelectorsKeysType> = `${T}.${keyof SelectorsType[T] & string}`;
