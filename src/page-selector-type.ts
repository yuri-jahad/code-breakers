export interface SelectorConfig {
	selector: string;
	all?: boolean;
}

// Les sélecteurs avec leurs valeurs
export const selectors = {
	rules: {
		rulesSpace: { selector: "#rules-space" },
	},
	topbarUser: {
		// renommé de "user" car c'est dans topbar-user-space
		userAvatar: { selector: "#user-avatar" },
		selectAvatar: { selector: "#select-avatar" },
		userPseudo: { selector: "#user-pseudo" },
	},
	infos: {
		currentMode: { selector: "#current-mode" },
		currentPlayer: { selector: "#current-player" },
		gameTimer: { selector: "#game-timer" },
		typingSpeed: { selector: "#typing-speed" },
		turnTime: { selector: "#turn-time" },
		correctWord: { selector: "#correct-word" },
		failWord: { selector: "#fail-word" },
		infosSpace: { selector: "#infos-space" },
	},
	game: {
		answerSpace: { selector: "#answer-space" },
		inputAnswer: { selector: "#input-answer" },
		letterCount: { selector: "#letter-count" },
		startGameAction: { selector: "#start-game-action" },
		gameCurrentState: { selector: "#game-current-state" },
		activePlayers: { selector: "#active-players" },
		currentPuzzle: { selector: "#current-puzzle" },
	},
	sidebar: {
		sidebarContent: { selector: "#sidebar-content" },
		chatSpace: { selector: "#chat-space" },
		chatMessages: { selector: "#chat-messages" },
		chatInput: { selector: "#chat-input" },
		chatInputSpace: { selector: "#chat-input-space" },
		chatSend: { selector: "#chat-send" },
		paramsSpace: { selector: "#params-space" },
		paramsBtn: { selector: "#params-btn" },
		chatBtn: { selector: "#chat-btn" },
	},
	params: {
		selectMode: { selector: "#select-mode" },
		turnTimeInput: { selector: "#turn-time-input" },
		turnTimeRange: { selector: "#turn-time-range" },
		minHeartsInput: { selector: "#min-hearts-input" },
		minHeartsRange: { selector: "#min-hearts-range" },
		maxHeartsInput: { selector: "#max-hearts-input" },
		maxHeartsRange: { selector: "#max-hearts-range" },
		botsInput: { selector: "#bots-input" },
		botsRange: { selector: "#bots-range" },
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
