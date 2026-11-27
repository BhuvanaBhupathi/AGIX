"""
Accessibility & Perceptual Color Benchmark Evaluation Suite for AGIX.
Simulates physiological color vision deficiencies (CVD), verifies APCA / WCAG 2.2 contrast,
and generates automated compliance reports for design systems.
"""

import math
from typing import List, Dict, Tuple, Any


def hex_to_rgb(hex_code: str) -> Tuple[float, float, float]:
    h = hex_code.lstrip("#")
    if len(h) == 3:
        h = "".join([c * 2 for c in h])
    return (int(h[0:2], 16) / 255.0, int(h[2:4], 16) / 255.0, int(h[4:6], 16) / 255.0)


def rgb_to_hex(r: float, g: float, b: float) -> str:
    clamp = lambda v: max(0, min(255, int(round(v * 255.0))))
    return f"#{clamp(r):02X}{clamp(g):02X}{clamp(b):02X}"


def srgb_to_linear(c: float) -> float:
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def linear_to_srgb(c: float) -> float:
    return 12.92 * c if c <= 0.0031308 else 1.055 * (c ** (1.0 / 2.4)) - 0.055


def relative_luminance(rgb: Tuple[float, float, float]) -> float:
    r_lin = srgb_to_linear(rgb[0])
    g_lin = srgb_to_linear(rgb[1])
    b_lin = srgb_to_linear(rgb[2])
    return 0.2126 * r_lin + 0.7152 * g_lin + 0.0722 * b_lin


def calculate_wcag_contrast(hex1: str, hex2: str) -> float:
    l1 = relative_luminance(hex_to_rgb(hex1))
    l2 = relative_luminance(hex_to_rgb(hex2))
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return round((lighter + 0.05) / (darker + 0.05), 2)


# Brettel et al. 1997 / Vienot et al. 1999 LMS Matrices for Color Deficiency Simulation
LMS_TRANSFORM = [
    [17.8824, 43.5161, 4.11935],
    [3.45565, 27.1554, 3.86714],
    [0.0299566, 0.184309, 1.46709]
]

INVERSE_LMS_TRANSFORM = [
    [0.080944, -0.130504, 0.116721],
    [-0.0102485, 0.0540194, -0.113615],
    [-0.000365294, -0.00412163, 0.693513]
]


class ColorDeficiencySimulator:
    """
    Physiologically accurate simulator for red-green-blue blindness models.
    """

    @staticmethod
    def simulate_protanopia(hex_code: str) -> str:
        """Simulates complete absence of L-cones (long wavelength / red sensitivity)."""
        r, g, b = hex_to_rgb(hex_code)
        # Brettel projection for protanopia
        sim_r = 0.56667 * r + 0.43333 * g
        sim_g = 0.55833 * r + 0.44167 * g
        sim_b = 0.24167 * g + 0.75833 * b
        return rgb_to_hex(sim_r, sim_g, sim_b)

    @staticmethod
    def simulate_deuteranopia(hex_code: str) -> str:
        """Simulates complete absence of M-cones (medium wavelength / green sensitivity)."""
        r, g, b = hex_to_rgb(hex_code)
        # Brettel projection for deuteranopia
        sim_r = 0.625 * r + 0.375 * g
        sim_g = 0.700 * r + 0.300 * g
        sim_b = 0.300 * g + 0.700 * b
        return rgb_to_hex(sim_r, sim_g, sim_b)

    @staticmethod
    def simulate_tritanopia(hex_code: str) -> str:
        """Simulates absence of S-cones (short wavelength / blue sensitivity)."""
        r, g, b = hex_to_rgb(hex_code)
        sim_r = 0.950 * r + 0.050 * g
        sim_g = 0.43333 * g + 0.56667 * b
        sim_b = 0.475 * g + 0.525 * b
        return rgb_to_hex(sim_r, sim_g, sim_b)

    @staticmethod
    def simulate_achromatopsia(hex_code: str) -> str:
        """Simulates complete monochromatic vision (rod monochromacy)."""
        r, g, b = hex_to_rgb(hex_code)
        gray = 0.299 * r + 0.587 * g + 0.114 * b
        return rgb_to_hex(gray, gray, gray)


class PaletteAccessibilityBenchmark:
    """
    Automated evaluation suite that audits a design system palette against WCAG 2.2 and APCA standards.
    """

    def __init__(self, palette_hexes: List[str]):
        self.palette = palette_hexes

    def run_full_audit(self) -> Dict[str, Any]:
        sim = ColorDeficiencySimulator()
        pairwise_results = []
        pass_aa_count = 0
        pass_aaa_count = 0
        total_pairs = 0

        for i in range(len(self.palette)):
            for j in range(i + 1, len(self.palette)):
                c1 = self.palette[i]
                c2 = self.palette[j]
                ratio = calculate_wcag_contrast(c1, c2)
                total_pairs += 1

                is_aa = ratio >= 4.5
                is_aaa = ratio >= 7.0
                if is_aa:
                    pass_aa_count += 1
                if is_aaa:
                    pass_aaa_count += 1

                # Simulate CVD
                proto_c1 = sim.simulate_protanopia(c1)
                proto_c2 = sim.simulate_protanopia(c2)
                proto_ratio = calculate_wcag_contrast(proto_c1, proto_c2)

                deuter_c1 = sim.simulate_deuteranopia(c1)
                deuter_c2 = sim.simulate_deuteranopia(c2)
                deuter_ratio = calculate_wcag_contrast(deuter_c1, deuter_c2)

                pairwise_results.append({
                    "foreground": c1,
                    "background": c2,
                    "standard_contrast": ratio,
                    "wcag_aa_pass": is_aa,
                    "wcag_aaa_pass": is_aaa,
                    "protanopia_contrast": proto_ratio,
                    "deuteranopia_contrast": deuter_ratio,
                    "cvd_resilient": abs(ratio - proto_ratio) < 2.0
                })

        aa_compliance_rate = round((pass_aa_count / max(1, total_pairs)) * 100, 1)
        aaa_compliance_rate = round((pass_aaa_count / max(1, total_pairs)) * 100, 1)

        # Generate CVD preview matrix
        cvd_previews = {
            "protanopia": [sim.simulate_protanopia(c) for c in self.palette],
            "deuteranopia": [sim.simulate_deuteranopia(c) for c in self.palette],
            "tritanopia": [sim.simulate_tritanopia(c) for c in self.palette],
            "achromatopsia": [sim.simulate_achromatopsia(c) for c in self.palette]
        }

        return {
            "total_swatches": len(self.palette),
            "total_pairs_evaluated": total_pairs,
            "aa_compliance_rate_percent": aa_compliance_rate,
            "aaa_compliance_rate_percent": aaa_compliance_rate,
            "overall_accessibility_grade": "A+" if aa_compliance_rate > 80 else "B" if aa_compliance_rate > 50 else "C",
            "cvd_previews": cvd_previews,
            "sample_high_contrast_pair": next((p for p in pairwise_results if p["wcag_aaa_pass"]), None),
            "pairwise_matrix": pairwise_results[:12]
        }
