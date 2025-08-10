from typing import List

from pydantic import BaseModel


class CardSearchRequest(BaseModel):
    card_name: str


class CardSearchResponse(BaseModel):
    name: str
    image: str | None = None


class MultiCardSearchResponse(BaseModel):
    cards: List[CardSearchResponse]
