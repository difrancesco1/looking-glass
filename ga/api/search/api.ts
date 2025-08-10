import { SingleCardResponse, MultiCardResponse } from "./types";

// Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const singleCardSearch = async (
  cardName: string,
): Promise<SingleCardResponse> => {
  const encodedCardName = encodeURIComponent(cardName.trim());
  const url = `${API_BASE_URL}/api/card-search/single-card-search?card_name=${encodedCardName}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
};

export const multiCardSearch = async (
  cardName: string,
): Promise<MultiCardResponse> => {
  const encodedCardName = encodeURIComponent(cardName.trim());
  const url = `${API_BASE_URL}/api/card-search/multi-card-search?card_name=${encodedCardName}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
};
