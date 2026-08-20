interface MistakeDotsProps {
  mistakesUsed: number;
  maxMistakes: number;
}

/** "Mistakes remaining" row: filled dots remaining, hollow dots used. */
export function MistakeDots({ mistakesUsed, maxMistakes }: MistakeDotsProps) {
  const remaining = Math.max(maxMistakes - mistakesUsed, 0);
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold">Mistakes remaining:</span>
      <div className="flex gap-1.5">
        {Array.from({ length: maxMistakes }, (_, i) => (
          <span
            key={i}
            className={`h-3.5 w-3.5 rounded-full ${
              i < remaining ? 'bg-tile-selected' : 'bg-transparent border border-tile-selected'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
