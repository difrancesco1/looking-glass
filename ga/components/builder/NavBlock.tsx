interface NavBlockProps {
  item: string;
  icon: React.ReactNode;
}

export default function NavBlock({ item, icon }: NavBlockProps) {
  return (
    <div className="border border-gray-500 bg-darkcard rounded-2xl flex flex-col justify-between p-6 h-full">
      <div className="flex flex-col gap-8">
        <div className="grid gap-2">
          <a className="flex items-center gap-2 group p-2 rounded-md -ml-2 transition-all hover:text-muted/50 cursor-pointer text-white text-lg">
            {icon}
            <span>{item}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
