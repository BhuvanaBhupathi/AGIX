"""
AGIX Brand Coherence Engine & Audit Module.
Scans color palettes, typography, and positioning to evaluate brand consistency.
"""

from typing import List, Dict, Any
from pydantic import BaseModel
from .color_quantizer import compute_apca_contrast, hex_to_rgb, rgb_to_hsl


class CoherenceAuditResult(BaseModel):
    overall_score: int
    color_consistency_score: int
    typography_consistency_score: int
    personality_alignment_score: int
    identified_conflicts: List[str]
    actionable_suggestions: List[str]
    confidence_level: float


def audit_brand_coherence(
    brand_name: str,
    palette_hexes: List[str],
    headline_font: str,
    body_font: str,
    target_personality: str = "Premium / Sophisticated",
) -> CoherenceAuditResult:
    """
    Perform deep heuristic and algorithmic brand consistency evaluation.
    """
    conflicts = []
    suggestions = []

    # 1. Color contrast checks
    color_score = 90
    if len(palette_hexes) >= 2:
        lc = compute_apca_contrast(palette_hexes[0], palette_hexes[-1])
        if lc < 60.0:
            color_score -= 15
            conflicts.append(f"Low perceptual contrast ({lc:.1f} Lc) between primary color and background.")
            suggestions.append("Adjust stop lightness by ±15% to guarantee APCA Normal Text compliance.")
        else:
            suggestions.append("Primary and secondary colors provide strong perceptual hierarchy.")

    # 2. Typography compatibility checks
    type_score = 88
    if headline_font.lower() == body_font.lower():
        type_score -= 10
        conflicts.append("Headline and body share the identical typeface, reducing structural hierarchy.")
        suggestions.append("Pair your primary font with an editorial serif or clean geometric grotesque.")
    else:
        suggestions.append(f"Strong pairing contrast between '{headline_font}' and '{body_font}'.")

    # 3. Personality alignment
    personality_score = 92
    if "minimal" in target_personality.lower() and len(palette_hexes) > 6:
        personality_score -= 12
        conflicts.append("High color count conflicts with minimal brand positioning.")
        suggestions.append("Restrain primary palette to 3 core swatches and 1 vibrant accent.")

    overall = int(round((color_score * 0.4) + (type_score * 0.35) + (personality_score * 0.25)))

    return CoherenceAuditResult(
        overall_score=overall,
        color_consistency_score=color_score,
        typography_consistency_score=type_score,
        personality_alignment_score=personality_score,
        identified_conflicts=conflicts,
        actionable_suggestions=suggestions,
        confidence_level=0.88,
    )
