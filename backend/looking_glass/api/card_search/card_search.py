import requests
from fastapi import APIRouter

from .models import CardSearchResponse
from .models import MultiCardSearchResponse
from looking_glass.db.card_search import normalize_card_name_to_slug
from looking_glass.db.card_search import parse_all_cards_response_data
from looking_glass.db.card_search import parse_card_response_data


card_search_router = APIRouter()


@card_search_router.get("/single-card-search")
def single_card_search(card_name: str) -> CardSearchResponse:
    card_slug = normalize_card_name_to_slug(card_name)

    api_url = f"https://api.gatcg.com/cards/{card_slug}"
    response = requests.get(api_url)
    card_data = response.json()

    card_name, image_url = parse_card_response_data(card_data)
    print(card_name, image_url)

    return CardSearchResponse(name=card_name, image=image_url)


@card_search_router.get("/multi-card-search")
def multi_card_search(card_name: str) -> MultiCardSearchResponse:
    card_slug = normalize_card_name_to_slug(card_name)

    api_url = f"https://api.gatcg.com/cards/search/?name={card_slug}"
    response = requests.get(api_url)
    response_data = response.json()

    all_cards = parse_all_cards_response_data(response_data)
    print(f"Found {len(all_cards)} cards")

    cards = [
        CardSearchResponse(name=name, image=image_url) for name, image_url in all_cards
    ]
    return MultiCardSearchResponse(cards=cards)
