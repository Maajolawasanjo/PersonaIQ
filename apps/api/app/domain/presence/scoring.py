from dataclasses import dataclass
from typing import List, Optional


@dataclass
class PresenceScoreResult:
    overall_presence_index: int
    confidence_score: int
    executive_vibe_score: int
    visual_impact_score: int
    grooming_score: int
    outfit_alignment_score: int
    summary_narrative: str


class PresenceScoringEngine:
    """Pure domain scoring engine for PersonaIQ Presence Index™ (0-100). Zero DB/HTTP dependencies."""

    @staticmethod
    def calculate_presence_index(
        event_importance: int = 3,
        dress_code: Optional[str] = None,
        skin_overall_score: int = 85,
        outfit_alignment_scores: Optional[List[int]] = None,
    ) -> PresenceScoreResult:
        scores = outfit_alignment_scores or [80]
        top_outfit_score = max(scores) if scores else 75
        avg_outfit_score = sum(scores) // len(scores) if scores else 75

        # 1. Executive Vibe (25% Weight)
        # Higher event importance demands higher alignment precision
        vibe_boost = (event_importance - 3) * 2
        executive_vibe = max(0, min(100, top_outfit_score + vibe_boost))

        # 2. Visual Impact (25% Weight)
        dress_code_bonus = 5 if dress_code and len(dress_code) > 0 else 0
        visual_impact = max(0, min(100, avg_outfit_score + dress_code_bonus))

        # 3. Grooming & Radiance (25% Weight)
        grooming_score = max(0, min(100, skin_overall_score))

        # 4. Outfit Alignment (25% Weight)
        outfit_alignment = max(0, min(100, top_outfit_score))

        # Overall Presence Index (0-100)
        raw_index = (
            (executive_vibe * 0.25)
            + (visual_impact * 0.25)
            + (grooming_score * 0.25)
            + (outfit_alignment * 0.25)
        )
        overall_presence_index = max(0, min(100, round(raw_index)))

        # Confidence Score (0-100)
        confidence = 92 if len(scores) >= 1 else 75

        # Narrative Summary
        narrative = (
            f"Your Presence Index™ is rated at {overall_presence_index}/100. "
            f"Executive Vibe stands at {executive_vibe}/100 with a grooming radiance score of {grooming_score}/100. "
            f"Outfit selection aligns with your target dress code '{dress_code or 'General Formal'}'."
        )

        return PresenceScoreResult(
            overall_presence_index=overall_presence_index,
            confidence_score=confidence,
            executive_vibe_score=executive_vibe,
            visual_impact_score=visual_impact,
            grooming_score=grooming_score,
            outfit_alignment_score=outfit_alignment,
            summary_narrative=narrative,
        )
