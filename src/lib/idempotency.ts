// Une clé par action. À réutiliser seulement pour un retry réseau de la même
// requête ; à régénérer dès que l'utilisateur change les données saisies.
export const newIdempotencyKey = () => crypto.randomUUID();