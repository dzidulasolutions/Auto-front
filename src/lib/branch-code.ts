// Suggère un code du style "LOM-0472" à partir du nom de la ville : 3 premières
// lettres en majuscule + un nombre aléatoire à 4 chiffres. L'Admin reste libre de le modifier.
export function suggestBranchCode(city: string): string {
  const prefix = city
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // retire les accents
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 3)
    .toUpperCase();

  const number = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  return prefix ? `${prefix}-${number}` : "";
}