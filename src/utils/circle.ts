/**
 * Retourne les coordonnées x et y d'un point sur un cercle
 * @param radius - Le rayon du cercle
 * @param index - L'index du point sur le cercle
 * @param itemsSize - Le nombre d'items sur le cercle
 * @returns Les coordonnées x et y du point
 */

export const circle = (radius: number, index: number, itemsSize: number) => {
  if (!radius || !itemsSize) return { x: 0, y: 0 }; 

  const angle = (index / itemsSize) * Math.PI * 2;
  const cosinus = Math.cos(angle) * radius;
  const sinus = Math.sin(angle) * radius;

  return {
    x: Math.round(cosinus + radius), 
    y: Math.round(sinus + radius), 
  };
};
