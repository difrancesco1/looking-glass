export interface SingleCardResponse {
  name: string;
  image: string | null;
}

export interface MultiCardResponse {
  cards: SingleCardResponse[];
}

export interface CardSearchError {
  message: string;
  status?: number;
}

export interface CardSearchRequest {
  card_name: string;
}
