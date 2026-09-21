type Tone = "neutral" | "success" | "error" | "warning";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface text-foreground",
  success: "bg-success-bg text-success",
  error: "bg-error-bg text-error",
  warning: "bg-warning-bg text-warning",
};

export default function Badge({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center h-6 px-2.5 text-caption font-medium uppercase tracking-wide rounded-control ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}