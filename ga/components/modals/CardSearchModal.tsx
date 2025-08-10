import styles from "./styles/CardSearchModal.module.css";
import { MultiCardResponse } from "@/api/search/types";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { useEffect } from "react";

interface CardSearchModalProps {
  searchResult: MultiCardResponse | null;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function CardSearchModal({
  searchResult,
  onClose,
  searchQuery,
  setSearchQuery,
}: CardSearchModalProps) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={styles.cardSearchModalContainer}
      onClick={handleBackdropClick}
    >
      <div className={styles.cardSearchModalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <ClearRoundedIcon sx={{ scale: 1.5 }} />
        </button>
        <div className={styles.modalHeader}>
          <Input
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
          />
          <Button className={styles.searchButton}>Search</Button>
        </div>
        {searchResult && searchResult.cards.length > 0 ? (
          <div className={styles.cardsContainer}>
            {searchResult.cards.map((card, index) => (
              <div key={index} className={styles.cardResult}>
                {card.image ? (
                  <div className={styles.cardImageContainer}>
                    <Image
                      src={card.image}
                      alt={card.name}
                      width={250}
                      height={350}
                      className={styles.cardImage}
                    />
                  </div>
                ) : (
                  <div className={styles.noImageContainer}>
                    <p>No image available</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noResultContainer}>
            <p>No results found</p>
          </div>
        )}
      </div>
    </div>
  );
}
