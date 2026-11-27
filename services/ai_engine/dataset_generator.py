"""
Comprehensive Synthetic Brand Dataset & Gold Standard Generator for AGIX.
Produces verified design token fixtures, multi-era palettes, APCA contrast benchmarks,
and typographic pairings for testing AI models and client applications.
"""

from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
import json


@dataclass
class BrandSpecimenFixture:
    slug: str
    name: str
    archetype: str
    description: str
    palette: Dict[str, str]
    oklch_values: Dict[str, str]
    typography: Dict[str, str]
    modular_scale: str
    personality_scores: Dict[str, float]
    tags: List[str] = field(default_factory=list)


GOLDEN_FIXTURES: List[BrandSpecimenFixture] = [
    BrandSpecimenFixture(
        slug="orblinn-nordic",
        name="Orblinn Studio",
        archetype="Warm Architectural Minimalism",
        description="Nordic interior architecture brand emphasizing silence, natural limestone textures, and unbleached linen.",
        palette={
            "surface": "#F7F7F5",
            "paper": "#EBEBE7",
            "ink_primary": "#191918",
            "accent_earth": "#8D8272",
            "accent_slate": "#727D8D"
        },
        oklch_values={
            "surface": "oklch(97.2% 0.005 85.4)",
            "paper": "oklch(93.5% 0.008 88.1)",
            "ink_primary": "oklch(15.2% 0.004 70.0)",
            "accent_earth": "oklch(56.8% 0.035 68.2)",
            "accent_slate": "oklch(55.4% 0.032 235.6)"
        },
        typography={
            "headline": "Satoshi",
            "body": "Editorial Serif",
            "mono": "Space Mono"
        },
        modular_scale="Major Third",
        personality_scores={
            "warmth": 0.88,
            "precision": 0.94,
            "expressiveness": 0.62,
            "tradition": 0.45,
            "digital_native": 0.78
        },
        tags=["Architecture", "Nordic", "Ceramics", "Minimal", "Interior"]
    ),
    BrandSpecimenFixture(
        slug="nova-mobility",
        name="NOVA Kinetic Systems",
        archetype="High-Velocity Tech Aerodynamics",
        description="Autonomous urban air mobility hardware system utilizing carbon fiber monocoques and luminous HUD telemetries.",
        palette={
            "surface": "#0A0D14",
            "paper": "#121722",
            "ink_primary": "#F1F5F9",
            "accent_cyan": "#00F0FF",
            "accent_violet": "#7000FF"
        },
        oklch_values={
            "surface": "oklch(12.1% 0.015 250.0)",
            "paper": "oklch(16.8% 0.022 248.5)",
            "ink_primary": "oklch(96.5% 0.008 240.0)",
            "accent_cyan": "oklch(88.2% 0.195 205.0)",
            "accent_violet": "oklch(48.5% 0.285 295.0)"
        },
        typography={
            "headline": "Clash Display",
            "body": "General Sans",
            "mono": "JetBrains Mono"
        },
        modular_scale="Perfect Fourth",
        personality_scores={
            "warmth": 0.15,
            "precision": 0.99,
            "expressiveness": 0.85,
            "tradition": 0.08,
            "digital_native": 0.98
        },
        tags=["Aerospace", "Autonomous", "Cyber", "Kinetic", "Electric"]
    ),
    BrandSpecimenFixture(
        slug="velora-skincare",
        name="Velora Haute Botanicals",
        archetype="Organic Luxury Dermatology",
        description="Micro-batch cold-pressed botanical skincare formulated in Grasse with clinical bio-ferments.",
        palette={
            "surface": "#FBF8F5",
            "paper": "#F3ECE3",
            "ink_primary": "#1E1A16",
            "accent_terracotta": "#C47B62",
            "accent_sage": "#7A8F78"
        },
        oklch_values={
            "surface": "oklch(98.1% 0.007 65.0)",
            "paper": "oklch(94.2% 0.018 72.0)",
            "ink_primary": "oklch(18.5% 0.012 55.0)",
            "accent_terracotta": "oklch(62.4% 0.115 42.5)",
            "accent_sage": "oklch(61.8% 0.045 138.0)"
        },
        typography={
            "headline": "Cinzel",
            "body": "Cabinet Grotesk",
            "mono": "Space Mono"
        },
        modular_scale="Golden Ratio",
        personality_scores={
            "warmth": 0.92,
            "precision": 0.84,
            "expressiveness": 0.76,
            "tradition": 0.68,
            "digital_native": 0.52
        },
        tags=["Luxury", "Botanical", "Skincare", "Tactile", "Editorial"]
    ),
    BrandSpecimenFixture(
        slug="synapse-capital",
        name="Synapse Algorithmic Partners",
        archetype="Systemic Quantitative Finance",
        description="Global hedge fund executing statistical arbitrage and deep liquidity modeling on high-throughput order books.",
        palette={
            "surface": "#0D1117",
            "paper": "#161B22",
            "ink_primary": "#E6EDF3",
            "accent_emerald": "#2EA043",
            "accent_amber": "#D29922"
        },
        oklch_values={
            "surface": "oklch(14.5% 0.012 245.0)",
            "paper": "oklch(18.2% 0.016 242.0)",
            "ink_primary": "oklch(94.0% 0.010 240.0)",
            "accent_emerald": "oklch(63.5% 0.145 145.0)",
            "accent_amber": "oklch(71.2% 0.155 78.0)"
        },
        typography={
            "headline": "Space Mono",
            "body": "General Sans",
            "mono": "Space Mono"
        },
        modular_scale="Major Second",
        personality_scores={
            "warmth": 0.22,
            "precision": 0.98,
            "expressiveness": 0.35,
            "tradition": 0.40,
            "digital_native": 0.95
        },
        tags=["Quant", "Finance", "Terminal", "Systemic", "Crypto"]
    )
]


class DatasetGenerator:
    """
    Synthesizes large-scale brand benchmark fixtures for model fine-tuning and evaluation.
    """

    @staticmethod
    def get_all_golden_fixtures() -> List[Dict[str, Any]]:
        return [
            {
                "slug": f.slug,
                "name": f.name,
                "archetype": f.archetype,
                "description": f.description,
                "palette": f.palette,
                "oklch": f.oklch_values,
                "typography": f.typography,
                "modular_scale": f.modular_scale,
                "personality": f.personality_scores,
                "tags": f.tags
            }
            for f in GOLDEN_FIXTURES
        ]

    @staticmethod
    def export_fixtures_json(filepath: str):
        fixtures = DatasetGenerator.get_all_golden_fixtures()
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(fixtures, f, indent=2)

    @staticmethod
    def generate_stress_test_cases(count: int = 50) -> List[Dict[str, Any]]:
        """
        Generates synthetic edge cases for contrast, gamut overflow, and mismatched font pairings.
        """
        cases = []
        harmonies = ["Complementary", "Analogous", "Triadic", "Tetradic", "Split-Complementary"]
        scales = ["Minor Second", "Major Second", "Minor Third", "Major Third", "Perfect Fourth", "Golden Ratio"]

        for i in range(count):
            h_val = (i * 137.5) % 360.0  # Golden angle distribution
            cases.append({
                "test_id": f"synthetic-case-{i+1:03d}",
                "base_hue": round(h_val, 2),
                "target_harmony": harmonies[i % len(harmonies)],
                "target_scale": scales[i % len(scales)],
                "expected_min_apca_contrast": 60.0,
                "wcag_aa_target": True
            })
        return cases
