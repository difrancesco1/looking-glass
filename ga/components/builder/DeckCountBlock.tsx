interface DeckCountBlockProps {
  title: string;
  count: number;
}

export default function DeckCountBlock({ title, count }: DeckCountBlockProps) {
  return (
    <div className="h-[87.63px] border border-gray-500 bg-darkcard flex items-center gap-2 rounded-2xl p-6 flex-1">
      <span className="text-white text-2xl font-bold">{title}</span>
      <span className="text-white text-2xl font-bold">{count}</span>
    </div>
  );
}
