import Image from "next/image";
import bg from "@/public/heroSuzaku.jpg";
import styles from "./styles/Hero.module.css";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import { multiCardSearch } from "@/api/search/api";
import CardSearchModal from "@/components/modals/CardSearchModal";
import { SingleCardResponse, MultiCardResponse } from "@/api/search/types";

export default function Hero() {
  const [mode, setMode] = useState("Decks");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResult, setSearchResult] = useState<MultiCardResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    const result = await multiCardSearch(query);
    console.log("Search result:", result);
    setSearchResult(result);
    setIsModalOpen(true);
    setIsLoading(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSearchResult(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery);
    }
  };

  return (
    <div className={styles.hero}>
      <Image src={bg} alt="Hero" fill className={styles.heroImage} />
      <div className={styles.heroContent}>
        <div className={styles.heroTextContainer}>
          <h1 className={styles.heroTitle}>LOOKING GLASS</h1>
          <span className={styles.heroSubtitle}>
            A modern deck builder for Grand Archive®
          </span>
        </div>
        <Toggle
          options={["Decks", "Cards"]}
          value={mode}
          onChange={setMode}
          className={styles.heroToggle}
        />
        <Input
          type="text"
          placeholder={isLoading ? "Searching..." : "Search"}
          className={styles.heroInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
      </div>
      {isModalOpen && (
        <CardSearchModal
          searchResult={searchResult}
          onClose={closeModal}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}
    </div>
  );
}
