"use client";

import DeckNameBlock from "@/components/builder/DeckNameBlock";
import NavBlock from "@/components/builder/NavBlock";
import DescriptionBlock from "@/components/builder/DescriptionBlock";
import DeckCountBlock from "@/components/builder/DeckCountBlock";
import CardDisplayBlock from "@/components/builder/CardDisplayBlock";
import FilterBlock from "@/components/builder/FilterBlock";
import StyleIcon from "@mui/icons-material/Style";

export default function Builder() {
  return (
    <div className="flex gap-4 p-4 bg-neutral-900 flex-row items-center justify-center h-screen">
      <nav className="flex flex-col gap-4 h-full flex-1">
        <DeckNameBlock title="Deck Name" />
        <NavBlock item="Cards" icon={<StyleIcon />} />
      </nav>
      <main className="flex flex-col gap-4 w-full h-full flex-6">
        <div className="flex flex-row gap-4">
          <DescriptionBlock description="Description" />
          <DeckCountBlock title="Decks" count={1} />
        </div>
        <div className="flex flex-row gap-4 h-full">
          <CardDisplayBlock />
          <FilterBlock />
        </div>
      </main>
    </div>
  );
}
