"""
AGIX AI Engine Command Line Interface (CLI).
Enables headless terminal audits, OKLCH palette synthesis, and typographic verification.
"""

import sys
import argparse
import json
from typing import List

from .color_quantizer import (
    generate_color_harmonies,
    compute_apca_contrast,
    rgb_to_oklch,
    hex_to_rgb,
)
from .typographic_intelligence import TypographicIntelligence
from .evaluation_benchmark import PaletteAccessibilityBenchmark
from .diffusion_prompter import DiffusionPrompter
from .coherence_analyzer import audit_brand_coherence


def main():
    parser = argparse.ArgumentParser(
        description="AGIX Multimodal AI Engine CLI for Studio Brand Designers."
    )
    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # Command: Harmony
    p_harm = subparsers.add_parser("harmony", help="Generate harmonic color palettes from base hex.")
    p_harm.add_argument("--hex", required=True, help="Base color in #RRGGBB format.")
    p_harm.add_argument("--type", default="Complementary", choices=[
        "Complementary", "Monochromatic", "Analogous", "Triadic", "Tetradic", "Split-Complementary"
    ], help="Color harmony type.")

    # Command: Typography
    p_type = subparsers.add_parser("typography", help="Score typographic pairing and modular scale.")
    p_type.add_argument("--headline", required=True, help="Headline typeface name.")
    p_type.add_argument("--body", required=True, help="Body typeface name.")
    p_type.add_argument("--scale", default="Major Third", help="Modular scale interval name.")

    # Command: Accessibility
    p_a11y = subparsers.add_parser("a11y", help="Run full WCAG 2.2 and APCA accessibility matrix audit.")
    p_a11y.add_argument("--colors", nargs="+", required=True, help="List of hex color codes.")

    # Command: Prompt
    p_prompt = subparsers.add_parser("prompt", help="Synthesize Midjourney / SDXL diffusion prompt.")
    p_prompt.add_argument("--brand", required=True, help="Brand name.")
    p_prompt.add_argument("--archetype", default="Luminous Minimal", help="Brand archetype.")
    p_prompt.add_argument("--colors", nargs="+", default=["#191918", "#E8973A"], help="Brand palette hexes.")

    args = parser.parse_args()

    if args.command == "harmony":
        result = generate_color_harmonies(args.hex, args.type)
        print(json.dumps(result, indent=2))

    elif args.command == "typography":
        engine = TypographicIntelligence()
        score = engine.score_font_pairing(args.headline, args.body)
        scale = engine.generate_modular_scale(scale_name=args.scale)
        output = {
            "pairing_analysis": score,
            "modular_type_scale": scale
        }
        print(json.dumps(output, indent=2))

    elif args.command == "a11y":
        bench = PaletteAccessibilityBenchmark(args.colors)
        report = bench.run_full_audit()
        print(json.dumps(report, indent=2))

    elif args.command == "prompt":
        prompter = DiffusionPrompter()
        pkg = prompter.build_brand_visual_prompt(
            brand_name=args.brand,
            style_archetype=args.archetype,
            primary_palette=args.colors
        )
        print(json.dumps(pkg, indent=2))

    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
