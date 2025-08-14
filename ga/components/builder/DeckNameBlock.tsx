import AcUnitIcon from "@mui/icons-material/AcUnit";

interface DeckNameBlockProps {
  title: string;
}

export default function DeckNameBlock({ title }: DeckNameBlockProps) {
  return (
    <div className="!h-[93.63px] border border-gray-500 bg-darkcard flex items-center gap-2 rounded-2xl p-6">
      <AcUnitIcon sx={{ fontSize: 30 }} />
      <h1 className="text-white text-xl font-bold">{title}</h1>
    </div>
  );
}
