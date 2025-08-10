import re
from typing import Any
from typing import Dict
from typing import List
from typing import Optional


def normalize_card_name_to_slug(card_name: str) -> str:
    slug = card_name.lower()
    slug = re.sub(r"['\"]", "", slug)
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug


def extract_image_url_from_card_data(card_data: Dict[str, Any]) -> Optional[str]:
    """Extract and format the image URL from Grand Archive API card data."""
    image_url = None

    # Check for editions array (for individual card data)
    if "editions" in card_data and len(card_data["editions"]) > 0:
        first_edition = card_data["editions"][0]
        image_url = first_edition.get("image")
    # Check for result_editions array (for multi-search results)
    elif "result_editions" in card_data and len(card_data["result_editions"]) > 0:
        first_edition = card_data["result_editions"][0]
        image_url = first_edition.get("image")

    # Prepend the base URL if the image path is relative
    if image_url and image_url.startswith("/"):
        image_url = f"https://api.gatcg.com{image_url}"

    return image_url


def parse_card_response_data(card_data: Dict[str, Any]) -> tuple[str, Optional[str]]:
    """Parse Grand Archive API response and extract card name and image URL."""
    card_name = card_data.get("name", "")
    image_url = extract_image_url_from_card_data(card_data)

    return card_name, image_url


def parse_multi_card_response_data(
    response_data: Dict[str, Any],
) -> tuple[str, Optional[str]]:
    """Parse Grand Archive API multi-card search response and extract first card's name and image URL."""
    # Multi-card search returns data in a 'data' array
    if "data" in response_data and len(response_data["data"]) > 0:
        first_card = response_data["data"][0]
        return parse_card_response_data(first_card)

    return "", None


def parse_all_cards_response_data(
    response_data: Dict[str, Any],
) -> List[tuple[str, Optional[str]]]:
    """Parse Grand Archive API multi-card search response and extract all cards' names and image URLs."""
    cards = []

    if "data" in response_data and len(response_data["data"]) > 0:
        for card_data in response_data["data"]:
            card_name, image_url = parse_card_response_data(card_data)
            cards.append((card_name, image_url))

    return cards
