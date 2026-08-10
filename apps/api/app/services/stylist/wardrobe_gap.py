from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

OCCASION_REQUIREMENTS = {
    "interview": {
        "required_categories": ["topwear", "bottomwear", "footwear"],
        "recommended_categories": ["accessories", "outerwear"],
        "min_formality": "Business Formal",
        "essential_items": ["Navy or Charcoal Suit/Blazer", "White/Light Shirt", "Black/Dark Oxfords"],
    },
    "meeting": {
        "required_categories": ["topwear", "bottomwear", "footwear"],
        "recommended_categories": ["accessories"],
        "min_formality": "Business Casual",
        "essential_items": ["Tailored Blazer", "Dress Shirt", "Loafers/Oxfords"],
    },
    "wedding": {
        "required_categories": ["topwear", "bottomwear", "footwear"],
        "recommended_categories": ["accessories"],
        "min_formality": "Formal",
        "essential_items": ["Suit or Formal Dress", "Dress Shoes", "Leather Watch"],
    },
    "conference": {
        "required_categories": ["topwear", "bottomwear", "footwear"],
        "recommended_categories": ["accessories"],
        "min_formality": "Business Casual",
        "essential_items": ["Smart Blazer", "Chinos/Trousers", "Leather Loafers"],
    },
}


class WardrobeGapAnalysis(BaseModel):
    readiness_score: int = Field(..., ge=0, le=100)
    owned_categories: List[str]
    missing_categories: List[str]
    missing_essential_items: List[str]
    recommendations: List[Dict[str, str]]


class WardrobeGapEngine:
    def analyze_gaps(self, occasion: str, user_items: List[Dict[str, Any]]) -> WardrobeGapAnalysis:
        reqs = OCCASION_REQUIREMENTS.get(occasion.lower(), OCCASION_REQUIREMENTS["interview"])
        
        owned_categories = set(item.get("category", "").lower() for item in user_items)
        required_cats = set(reqs["required_categories"])
        
        missing_cats = list(required_cats - owned_categories)
        
        # Calculate readiness score
        fulfilled = len(required_cats - set(missing_cats))
        readiness = int((fulfilled / len(required_cats)) * 100) if required_cats else 100
        
        missing_essentials = []
        if "footwear" in missing_cats:
            missing_essentials.append("Formal Footwear (Black Oxfords or Brown Loafers)")
        if "topwear" in missing_cats:
            missing_essentials.append("Structured Navy or Charcoal Blazer")
        if "bottomwear" in missing_cats:
            missing_essentials.append("Tailored Dress Trousers")

        recommendations = [
            {
                "item_name": missing,
                "reason": f"Essential for completing a high-impact {occasion} look.",
                "search_query": f"Buy {missing} online",
            }
            for missing in missing_essentials
        ]

        return WardrobeGapAnalysis(
            readiness_score=readiness,
            owned_categories=list(owned_categories),
            missing_categories=missing_cats,
            missing_essential_items=missing_essentials,
            recommendations=recommendations,
        )
