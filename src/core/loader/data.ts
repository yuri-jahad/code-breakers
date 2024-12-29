import { ModeCodeHttpType, ModeEnglishType } from "@/types/game/modes";
import fetchGameData from "@/utils/fetch-game-data";

/**
* Interface définissant la structure des données du jeu
* @interface
* @property {ModeCodeHttpType[]} httpCode - Liste des codes HTTP pour le mode code
* @property {ModeEnglishType[]} english - Liste des mots anglais pour le mode english
*/
interface GameData {
 httpCode: ModeCodeHttpType[];
 english: ModeEnglishType[];
}

/**
* Chemins d'accès aux fichiers de données du jeu
* @constant {Readonly<{HTTP_CODE: string, ENGLISH: string}>}
*/
const DATA_PATHS = {
 HTTP_CODE: "/src/data/http-codes.json",
 ENGLISH: "/src/data/english.json",
} as const;


/**
* Charge toutes les données nécessaires au jeu
* @returns {Promise<GameData>} Un objet contenant toutes les données du jeu
* @throws {Error} Si le chargement d'une des ressources échoue
*/
async function loadGameData(): Promise<GameData> {
 const [httpCodeData, englishData] = await Promise.all([
   fetchGameData<ModeCodeHttpType[]>(DATA_PATHS.HTTP_CODE),
   fetchGameData<ModeEnglishType[]>(DATA_PATHS.ENGLISH),
 ]);

 return {
   httpCode: httpCodeData,
   english: englishData,
 };
}

export default await loadGameData();