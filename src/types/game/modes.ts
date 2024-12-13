export type ModeCodeHttpType = { message: string; code: string };
export type ModeEnglishType = { en: string; fr: string };
export type Modes = ModeCodeHttpType | ModeEnglishType;
export type ModesNames = "code-http" | "english";
