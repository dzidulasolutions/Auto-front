/** Bloc de chargement neutre : prend la couleur du texte (fond noir ou blanc). */
// export function Skeleton({ className = "" }: { className?: string }) {
//   return <div aria-hidden className={`animate-pulse bg-current opacity-10 ${className}`} />;
// }

export default function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-black/10 ${className}`} />;
}