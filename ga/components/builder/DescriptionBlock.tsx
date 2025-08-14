interface DescriptionBlockProps {
  description: string;
}

export default function DescriptionBlock({
  description,
}: DescriptionBlockProps) {
  return (
    <div className="h-[87.63px] border-gray-500 bg-darkcard rounded-2xl border flex items-center justify-between p-6 flex-2">
      <span className="text-white text-2xl font-bold">{description}</span>
    </div>
  );
}
