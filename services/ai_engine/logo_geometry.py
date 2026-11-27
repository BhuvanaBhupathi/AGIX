"""
Logo & Monogram Geometric Precision Analyzer for AGIX.
Calculates golden ratio proportion adherence, optical center-of-mass,
vector contour density, and negative space ratios for brand marks.
"""

from typing import List, Dict, Tuple, Any, Optional
import math


@dataclass_point = Tuple[float, float]


class LogoGeometryEngine:
    """
    Mathematical inspection engine for brand identity marks and vector glyphs.
    """

    GOLDEN_RATIO: float = 1.61803398875

    def __init__(self):
        pass

    def calculate_bounding_metrics(
        self,
        width: float,
        height: float
    ) -> Dict[str, Any]:
        """
        Calculates aspect ratio, deviation from 1:1 square, and golden rectangle fit.
        """
        if height <= 0 or width <= 0:
            return {"aspect_ratio": 1.0, "error": "Invalid dimensions"}

        aspect = width / height
        inv_aspect = height / width

        golden_error = min(
            abs(aspect - self.GOLDEN_RATIO),
            abs(inv_aspect - self.GOLDEN_RATIO)
        )
        square_error = abs(aspect - 1.0)

        is_golden = golden_error < 0.08
        is_square = square_error < 0.05

        return {
            "width": width,
            "height": height,
            "aspect_ratio": round(aspect, 3),
            "is_square": is_square,
            "is_golden_rectangle": is_golden,
            "golden_ratio_fit_score": round(max(0.0, 100.0 - (golden_error * 120.0)), 1),
            "recommended_padding_px": round(min(width, height) * 0.15, 1)
        }

    def compute_optical_center_of_mass(
        self,
        polygon_vertices: List[Tuple[float, float]]
    ) -> Dict[str, Any]:
        """
        Computes the visual centroid of a logo contour using Green's theorem on simple 2D polygons.
        """
        n = len(polygon_vertices)
        if n < 3:
            # Fallback to midpoint
            return {"centroid": (0.0, 0.0), "area": 0.0, "is_balanced": True}

        signed_area = 0.0
        c_x = 0.0
        c_y = 0.0

        for i in range(n):
            x0, y0 = polygon_vertices[i]
            x1, y1 = polygon_vertices[(i + 1) % n]
            cross = (x0 * y1) - (x1 * y0)
            signed_area += cross
            c_x += (x0 + x1) * cross
            c_y += (y0 + y1) * cross

        signed_area *= 0.5
        if abs(signed_area) < 1e-6:
            return {"centroid": (0.0, 0.0), "area": 0.0, "is_balanced": True}

        c_x /= (6.0 * signed_area)
        c_y /= (6.0 * signed_area)

        # Compute geometric bounding center
        xs = [p[0] for p in polygon_vertices]
        ys = [p[1] for p in polygon_vertices]
        geo_center_x = (min(xs) + max(xs)) / 2.0
        geo_center_y = (min(ys) + max(ys)) / 2.0

        optical_offset_x = c_x - geo_center_x
        optical_offset_y = c_y - geo_center_y
        total_offset = math.hypot(optical_offset_x, optical_offset_y)

        return {
            "optical_centroid": (round(c_x, 2), round(c_y, 2)),
            "geometric_center": (round(geo_center_x, 2), round(geo_center_y, 2)),
            "contour_area_sq_px": round(abs(signed_area), 1),
            "optical_offset_px": round(total_offset, 2),
            "requires_optical_compensation": total_offset > 3.5,
            "compensation_vector": {
                "dx": round(-optical_offset_x, 2),
                "dy": round(-optical_offset_y, 2)
            }
        }

    def evaluate_monogram_legibility(
        self,
        character: str,
        stroke_width_px: float,
        bounding_size_px: float
    ) -> Dict[str, Any]:
        """
        Inspects stroke-to-bounding-box ratios to ensure crisp rendering at 16px favicon scale.
        """
        ratio = stroke_width_px / max(1.0, bounding_size_px)

        # Ideal stroke ratio is between 0.08 and 0.16
        is_subpixel_risk = ratio < 0.06
        is_heavy_clogging_risk = ratio > 0.22

        return {
            "character": character,
            "stroke_ratio": round(ratio, 3),
            "micro_favicon_viable": not is_subpixel_risk and not is_heavy_clogging_risk,
            "retina_crispness_grade": "A+" if 0.09 <= ratio <= 0.15 else "B",
            "diagnosis": "Ideal weight distribution." if not is_subpixel_risk else "Strokes will vanish at 16px. Increase stroke weight."
        }
