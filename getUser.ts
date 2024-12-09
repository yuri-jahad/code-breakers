/**
* Interface représentant les informations d'un utilisateur
* @interface UserInfo
* @property {string} pseudo - Le pseudonyme de l'utilisateur
* @property {string} avatar - L'URL ou le Data URL de l'avatar de l'utilisateur
*/
interface UserInfo {
  pseudo: string;
  avatar: string;
 }
 
 /**
 * Valeurs par défaut pour les informations utilisateur
 * @constant {Readonly<UserInfo>}
 */
 const DEFAULT_USER: Readonly<UserInfo> = {
  pseudo: "Anonyme",
  avatar: "/images/default.png",
 } as const;
 
 /**
 * Clé utilisée pour stocker les informations utilisateur dans le localStorage
 * @constant {string}
 */
 const USER_STORAGE_KEY = "userData";
 
 /**
 * Récupère les informations de l'utilisateur depuis le localStorage
 * @returns {UserInfo} Les informations de l'utilisateur ou les valeurs par défaut
 */
 export function getUserInfo(): UserInfo {
  try {
    const storedData = localStorage.getItem(USER_STORAGE_KEY);
    
    if (!storedData) {
      return { ...DEFAULT_USER };
    }
 
    const userInfo: UserInfo = JSON.parse(storedData);
    
    // Validation des données
    if (!userInfo.pseudo || !userInfo.avatar) {
      console.warn('Invalid user data found in localStorage');
      return { ...DEFAULT_USER };
    }
 
    return userInfo;
  } catch (error) {
    console.error('Error reading user data from localStorage:', error);
    return { ...DEFAULT_USER };
  }
 }
 
 /**
 * Sauvegarde les informations de l'utilisateur dans le localStorage
 * @param {UserInfo} userInfo - Les informations à sauvegarder
 * @returns {boolean} True si la sauvegarde a réussi, False sinon
 */
 export function saveUserInfo(userInfo: UserInfo): boolean {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userInfo));
    return true;
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
    return false;
  }
 }
 
 /**
 * Supprime les informations de l'utilisateur du localStorage
 * @returns {boolean} True si la suppression a réussi, False sinon
 */
 export function clearUserInfo(): boolean {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing user data from localStorage:', error);
    return false;
  }
 }
 
 export type { UserInfo };