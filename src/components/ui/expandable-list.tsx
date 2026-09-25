"use client";

import { useState } from "react";

interface Props<T> {
  items: T[];
  collapsedCount?: number;
  threshold?: number;
  renderItem: (item: T) => React.ReactNode;
  className?: string;
}

export default function ExpandableList<T>({
  items,
  collapsedCount = 2,
  threshold = 5,
  renderItem,
  className = "",
}: Props<T>) {
  const [expanded, setExpanded] = useState(false);

  const shouldCollapse = items.length > threshold;
  const visible = expanded || !shouldCollapse ? items : items.slice(0, collapsedCount);
  const hiddenCount = items.length - collapsedCount;

  return (
    <div className={className}>
      {visible.map((item, i) => (
        <div key={i}>{renderItem(item)}</div>
      ))}

      {shouldCollapse && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-full h-10 text-small text-muted hover:text-foreground transition-colors"
        >
          {expanded ? "Voir moins" : `Voir ${hiddenCount} de plus`}
        </button>
      )}
    </div>
  );
}