"""
Typographic Intelligence Engine for AGIX.
Provides deep classification, font pairing scoring, scale generator, and readability metrics.
"""

from dataclasses import dataclass, field
from typing import List, Dict, Tuple, Optional, Any
import math


@dataclass
class TypeClassification:
    category: str
    historical_era: str
    x_height_ratio: float
    contrast_ratio: float
    aperture: str
    serif_type: Optional[str] = None
    mood_tags: List[str] = field(default_factory=list)


TYPOGRAPHIC_KNOWLEDGE_BASE: Dict[str, TypeClassification] = {
    "Satoshi": TypeClassification(
        category="Geometric Grotesque",
        historical_era="Contemporary Digital",
        x_height_ratio=0.72,
        contrast_ratio=1.08,
        aperture="Open",
        serif_type=None,
        mood_tags=["Modern", "Clean", "Tech-Forward", "Balanced", "Authoritative"]
    ),
    "Editorial Serif": TypeClassification(
        category="Transitional High-Contrast Serif",
        historical_era="Editorial Renaissance",
        x_height_ratio=0.64,
        contrast_ratio=2.45,
        aperture="Semi-Closed",
        serif_type="Fine Bracketed",
        mood_tags=["Luxury", "Literary", "Sophisticated", "Haute Couture", "Thoughtful"]
    ),
    "Clash Display": TypeClassification(
        category="Neo-Brutalist Display",
        historical_era="Post-Modern Digital",
        x_height_ratio=0.76,
        contrast_ratio=1.85,
        aperture="Tight",
        serif_type=None,
        mood_tags=["Disruptive", "Bold", "Urban", "Avant-Garde", "Energetic"]
    ),
    "General Sans": TypeClassification(
        category="Neo-Grotesque",
        historical_era="Swiss International Style Modernized",
        x_height_ratio=0.70,
        contrast_ratio=1.04,
        aperture="Neutral",
        serif_type=None,
        mood_tags=["Universal", "Reliable", "Corporate", "Invisible", "Legible"]
    ),
    "Cabinet Grotesk": TypeClassification(
        category="Quirky Humanist Sans",
        historical_era="Art Deco / Industrial Hybrid",
        x_height_ratio=0.68,
        contrast_ratio=1.35,
        aperture="Wide",
        serif_type=None,
        mood_tags=["Artisanal", "Boutique", "Warm", "Tactile", "Human"]
    ),
    "Cinzel": TypeClassification(
        category="Roman Classical Serif",
        historical_era="Imperial Roman Inscriptional",
        x_height_ratio=0.58,
        contrast_ratio=2.80,
        aperture="Open",
        serif_type="Unbracketed Wedge",
        mood_tags=["Heritage", "Architectural", "Monolithic", "Timeless", "Solemn"]
    ),
    "Syne": TypeClassification(
        category="Exploratory Geometric Sans",
        historical_era="Post-Web3 Experimental",
        x_height_ratio=0.75,
        contrast_ratio=1.50,
        aperture="Extreme",
        serif_type=None,
        mood_tags=["Futuristic", "Fluid", "Eclectic", "Creative Lab", "Synthetic"]
    ),
    "Space Mono": TypeClassification(
        category="Mechanical Monospace",
        historical_era="Cold War Cybernetics",
        x_height_ratio=0.65,
        contrast_ratio=1.02,
        aperture="Angular",
        serif_type=None,
        mood_tags=["Computational", "Terminal", "Systemic", "Precise", "Raw"]
    )
}

SCALE_RATIOS: Dict[str, float] = {
    "Minor Second": 1.067,
    "Major Second": 1.125,
    "Minor Third": 1.200,
    "Major Third": 1.250,
    "Perfect Fourth": 1.333,
    "Augmented Fourth": 1.414,
    "Perfect Fifth": 1.500,
    "Golden Ratio": 1.618
}


class TypographicIntelligence:
    """
    Core AI scoring and generation engine for typographic systems.
    Evaluates pairing tension, legibility, and architectural scales.
    """

    def __init__(self):
        self.kb = TYPOGRAPHIC_KNOWLEDGE_BASE
        self.ratios = SCALE_RATIOS

    def generate_modular_scale(
        self,
        base_size: float = 16.0,
        scale_name: str = "Major Third",
        steps_down: int = 2,
        steps_up: int = 6
    ) -> List[Dict[str, Any]]:
        """
        Computes a proportional typographic type scale based on musical intervals.
        """
        ratio = self.ratios.get(scale_name, 1.250)
        scale = []

        # Downward scale (captions, micro-copy, tags)
        for i in range(steps_down, 0, -1):
            size = base_size / (ratio ** i)
            line_height = self._calculate_optimal_leading(size, is_display=False)
            scale.append({
                "step": -i,
                "token": f"text-caption-{i}",
                "size_px": round(size, 1),
                "size_rem": round(size / 16.0, 3),
                "line_height_px": round(line_height, 1),
                "line_height_ratio": round(line_height / size, 2),
                "recommended_tracking": "+0.03em"
            })

        # Base body step
        base_lh = self._calculate_optimal_leading(base_size, is_display=False)
        scale.append({
            "step": 0,
            "token": "text-body",
            "size_px": round(base_size, 1),
            "size_rem": 1.0,
            "line_height_px": round(base_lh, 1),
            "line_height_ratio": round(base_lh / base_size, 2),
            "recommended_tracking": "0em"
        })

        # Upward steps (subheads, headers, display heroes)
        tokens = ["text-h5", "text-h4", "text-h3", "text-h2", "text-h1", "text-hero"]
        for i in range(1, steps_up + 1):
            size = base_size * (ratio ** i)
            is_display = i >= 4
            lh = self._calculate_optimal_leading(size, is_display=is_display)
            token_name = tokens[i - 1] if i - 1 < len(tokens) else f"text-display-{i}"
            tracking = "-0.01em" if i < 3 else "-0.025em" if i < 5 else "-0.04em"
            scale.append({
                "step": i,
                "token": token_name,
                "size_px": round(size, 1),
                "size_rem": round(size / 16.0, 3),
                "line_height_px": round(lh, 1),
                "line_height_ratio": round(lh / size, 2),
                "recommended_tracking": tracking
            })

        return scale

    def _calculate_optimal_leading(self, font_size: float, is_display: bool) -> float:
        """
        Calculates optically balanced leading: as font size increases,
        line height ratio tightens to maintain cohesion.
        """
        if is_display:
            # Display text requires tight leading: 1.05 - 1.15
            ratio = max(1.05, 1.25 - (font_size / 240.0))
        else:
            # Body text requires generous reading leading: 1.45 - 1.65
            ratio = max(1.35, 1.65 - (font_size / 150.0))
        return font_size * ratio

    def score_font_pairing(
        self,
        headline_font: str,
        body_font: str
    ) -> Dict[str, Any]:
        """
        Evaluates the dynamic synergy and contrast between headline and body typefaces.
        """
        head_meta = self.kb.get(headline_font, TypeClassification(
            category="Custom Display",
            historical_era="Modern",
            x_height_ratio=0.70,
            contrast_ratio=1.5,
            aperture="Open"
        ))

        body_meta = self.kb.get(body_font, TypeClassification(
            category="Custom Body",
            historical_era="Modern",
            x_height_ratio=0.72,
            contrast_ratio=1.1,
            aperture="Open"
        ))

        # 1. Structural Contrast Score (0 to 100)
        # Pairs work best when there is clear difference in category (e.g. Serif + Sans)
        category_contrast = 0.0
        if head_meta.category != body_meta.category:
            if ("Serif" in head_meta.category and "Sans" in body_meta.category) or \
               ("Sans" in head_meta.category and "Serif" in body_meta.category):
                category_contrast = 95.0
            elif "Monospace" in body_meta.category or "Monospace" in head_meta.category:
                category_contrast = 88.0
            else:
                category_contrast = 78.0
        else:
            category_contrast = 45.0  # Same category requires distinct weight/geometry

        # 2. X-Height Harmonization (0 to 100)
        # Body fonts with generous x-height (>0.70) are superior for screen readability
        x_height_fit = 95.0 if body_meta.x_height_ratio >= 0.70 else 75.0

        # 3. Stroke Contrast Balance (0 to 100)
        # High-contrast headline + low-contrast body creates maximum visual interest
        contrast_delta = abs(head_meta.contrast_ratio - body_meta.contrast_ratio)
        contrast_score = min(100.0, 60.0 + (contrast_delta * 22.0))

        # Overall composite pairing score
        composite_score = round(
            (category_contrast * 0.45) +
            (x_height_fit * 0.30) +
            (contrast_score * 0.25),
            1
        )

        # Generate actionable diagnosis
        diagnosis = []
        if composite_score >= 88.0:
            rating = "Exceptional Pairing"
            diagnosis.append(f"{headline_font} and {body_font} exhibit textbook tension: expressive headline authority with effortless body legibility.")
        elif composite_score >= 75.0:
            rating = "Harmonious Dynamic"
            diagnosis.append(f"Solid contrast between {head_meta.category} and {body_meta.category}. Ensure tracking is calibrated.")
        else:
            rating = "Subtle / High Similarity"
            diagnosis.append(f"Both typefaces share similar structural archetypes. Consider increasing weight variance.")

        return {
            "headline_font": headline_font,
            "headline_category": head_meta.category,
            "body_font": body_font,
            "body_category": body_meta.category,
            "composite_score": composite_score,
            "rating": rating,
            "metrics": {
                "structural_contrast": round(category_contrast, 1),
                "x_height_compatibility": round(x_height_fit, 1),
                "stroke_contrast_delta": round(contrast_delta, 2)
            },
            "recommendations": diagnosis,
            "recommended_scale": "Major Third" if "Serif" in head_meta.category else "Perfect Fourth"
        }
