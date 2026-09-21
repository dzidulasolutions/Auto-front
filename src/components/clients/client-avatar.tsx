import type { Client } from "@/types/client";

export default function ClientAvatar({ client }: { client: Client }) {
  if (client.photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={client.photoUrl}
        alt={`${client.firstName} ${client.lastName}`}
        className="size-10 rounded-full object-cover shrink-0"
      />
    );
  }

  const initials = `${client.firstName[0] ?? ""}${client.lastName[0] ?? ""}`.toUpperCase();
  return (
    <span className="size-10 rounded-full bg-black text-white text-xs font-medium flex items-center justify-center shrink-0">
      {initials}
    </span>
  );
}