interface StatTileProps {
  label: string;
  /** The number, or a placeholder while it loads. */
  value: React.ReactNode;
  /** Plain-words context for the number. */
  detail: React.ReactNode;
}

/** One headline number. */
export function StatTile({ label, value, detail }: StatTileProps) {
  return (
    <div className="border-l-4 border-iron pl-4">
      <dt className="eyebrow">{label}</dt>
      <dd>
        <span className="headline block py-1 text-7xl tabular-nums">{value}</span>
        <span className="block text-xs text-steel">{detail}</span>
      </dd>
    </div>
  );
}
