export function formatFcfa(value: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(Math.round(value))} FCFA`;
}

export default function Amount({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  return (
    <span className={`text-numeric font-numeric tabular-nums ${className}`}>
      {formatFcfa(value)}
    </span>
  );
}