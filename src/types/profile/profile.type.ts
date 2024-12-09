export type ProfileStats = {
    id: number;
    avatar: string;
    name: string;
    heart: number;
    correctWord: number;
    failWord: number;
    speed: {
      start: number;
      end: number;
    };
	status: "death" | "alive";
};
