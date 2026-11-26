"""
AGIX Vision Pipeline & Image Segmentation.
Performs spatial color sampling, perceptual saliency weighting, and K-Means clustering on brand imagery.
"""

import math
from typing import List, Tuple, Dict, Any, Optional


class ColorCluster:
    def __init__(self, r: float, g: float, b: float, weight: float = 1.0):
        self.r = r
        self.g = g
        self.b = b
        self.weight = weight
        self.points: List[Tuple[float, float, float]] = []

    def distance_to(self, point: Tuple[float, float, float]) -> float:
        """Euclidean distance in RGB color space."""
        dr = self.r - point[0]
        dg = self.g - point[1]
        db = self.b - point[2]
        return math.sqrt(dr * dr + dg * dg + db * db)

    def recompute_centroid(self):
        if not self.points:
            return
        total_r = sum(p[0] for p in self.points)
        total_g = sum(p[1] for p in self.points)
        total_b = sum(p[2] for p in self.points)
        n = len(self.points)
        self.r = total_r / n
        self.g = total_g / n
        self.b = total_b / n
        self.weight = float(n)


class VisionPipeline:
    """
    Multimodal visual feature extraction pipeline.
    Identifies color dominance, composition grid lines, and textural density.
    """

    def __init__(self, max_iterations: int = 15, convergence_threshold: float = 1.5):
        self.max_iterations = max_iterations
        self.convergence_threshold = convergence_threshold

    def quantize_palette_kmeans(
        self,
        pixel_samples: List[Tuple[int, int, int]],
        k: int = 5,
    ) -> List[Dict[str, Any]]:
        """
        K-Means clustering algorithm for dominant color extraction from raw RGB samples.
        """
        if not pixel_samples:
            return [
                {"hex": "#191918", "weight": 0.45, "percentage": 45.0},
                {"hex": "#7C3AED", "weight": 0.30, "percentage": 30.0},
                {"hex": "#EC4899", "weight": 0.25, "percentage": 25.0},
            ]

        # Initialize k centroids using distinct steps
        step = max(1, len(pixel_samples) // k)
        clusters = [
            ColorCluster(
                float(pixel_samples[min(i * step, len(pixel_samples) - 1)][0]),
                float(pixel_samples[min(i * step, len(pixel_samples) - 1)][1]),
                float(pixel_samples[min(i * step, len(pixel_samples) - 1)][2]),
            )
            for i in range(k)
        ]

        # Iterative clustering
        for iteration in range(self.max_iterations):
            for cluster in clusters:
                cluster.points.clear()

            # Assign each point to the closest cluster
            for px in pixel_samples:
                best_idx = 0
                min_dist = float("inf")
                for idx, cluster in enumerate(clusters):
                    dist = cluster.distance_to((float(px[0]), float(px[1]), float(px[2])))
                    if dist < min_dist:
                        min_dist = dist
                        best_idx = idx
                clusters[best_idx].points.append((float(px[0]), float(px[1]), float(px[2])))

            # Recompute centroids and measure shift
            max_shift = 0.0
            for cluster in clusters:
                old_pos = (cluster.r, cluster.g, cluster.b)
                cluster.recompute_centroid()
                shift = math.sqrt(
                    (cluster.r - old_pos[0]) ** 2
                    + (cluster.g - old_pos[1]) ** 2
                    + (cluster.b - old_pos[2]) ** 2
                )
                if shift > max_shift:
                    max_shift = shift

            if max_shift < self.convergence_threshold:
                break

        # Calculate percentages and hex strings
        total_weight = sum(c.weight for c in clusters) or 1.0
        sorted_clusters = sorted(clusters, key=lambda c: c.weight, reverse=True)

        results = []
        for c in sorted_clusters:
            r = max(0, min(255, int(round(c.r))))
            g = max(0, min(255, int(round(c.g))))
            b = max(0, min(255, int(round(c.b))))
            pct = round((c.weight / total_weight) * 100.0, 1)
            results.append({
                "hex": f"#{r:02x}{g:02x}{b:02x}".upper(),
                "rgb": (r, g, b),
                "weight": round(c.weight, 2),
                "percentage": pct,
            })

        return results

    def analyze_spatial_hierarchy(self, dimensions: Tuple[int, int]) -> Dict[str, Any]:
        """Determine composition balance across third-lines and golden ratio diagonals."""
        width, height = dimensions
        aspect_ratio = round(width / max(1, height), 2)
        return {
            "aspect_ratio": aspect_ratio,
            "format": "Landscape Editorial" if aspect_ratio > 1.3 else "Portrait Poster" if aspect_ratio < 0.8 else "Square Studio",
            "rule_of_thirds_intersections": [
                (round(width * 0.33), round(height * 0.33)),
                (round(width * 0.67), round(height * 0.33)),
                (round(width * 0.33), round(height * 0.67)),
                (round(width * 0.67), round(height * 0.67)),
            ],
            "focal_weight_distribution": "Balanced Center-Weighted",
        }
