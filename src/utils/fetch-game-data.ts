/**
 * Récupère les données du jeu depuis une URL donnée
 * @template T - Type des données attendues
 * @param {string} url - URL du fichier de données à récupérer
 * @returns {Promise<T>} Les données typées récupérées
 * @throws {Error} Si la requête échoue ou si la réponse n'est pas ok
 */
export default async function fetchGameData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`Failed to fetch data from ${url}:`, error);
    throw error;
  }
}
