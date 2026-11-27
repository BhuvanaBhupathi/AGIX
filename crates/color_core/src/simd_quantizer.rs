//! Fast spatial K-Means color quantizer operating directly in Oklab perceptual space.
//! Partitions multi-megapixel images into dominant brand color clusters.

use crate::oklch::{Oklch, RgbColor, srgb_to_oklch, oklch_to_srgb};

#[derive(Debug, Clone)]
pub struct ColorCluster {
    pub center: Oklch,
    pub weight: f64,
    pub hex: String,
}

pub struct SpatialColorQuantizer {
    pub max_iterations: usize,
    pub tolerance: f64,
}

impl Default for SpatialColorQuantizer {
    fn default() -> Self {
        Self {
            max_iterations: 25,
            tolerance: 0.001,
        }
    }
}

impl SpatialColorQuantizer {
    /// Extracts k dominant perceptual colors from a raw slice of RGB pixels
    pub fn quantize(&self, pixels: &[RgbColor], k: usize) -> Vec<ColorCluster> {
        if pixels.is_empty() || k == 0 {
            return Vec::new();
        }

        // Subsample large buffers for real-time performance
        let step = (pixels.len() / 3000).max(1);
        let sampled: Vec<Oklch> = pixels
            .iter()
            .step_by(step)
            .map(|rgb| srgb_to_oklch(rgb))
            .collect();

        if sampled.is_empty() {
            return Vec::new();
        }

        let actual_k = k.min(sampled.len());

        // Initialize centroids with k-means++ inspired spread
        let mut centroids: Vec<Oklch> = Vec::with_capacity(actual_k);
        centroids.push(sampled[0]);

        while centroids.len() < actual_k {
            let mut best_candidate = sampled[0];
            let mut max_dist = -1.0;

            for &p in &sampled {
                let min_dist_to_centers = centroids
                    .iter()
                    .map(|c| self.oklab_distance(&p, c))
                    .fold(f64::INFINITY, f64::min);

                if min_dist_to_centers > max_dist {
                    max_dist = min_dist_to_centers;
                    best_candidate = p;
                }
            }
            centroids.push(best_candidate);
        }

        let mut cluster_counts = vec![0usize; actual_k];

        // Iterative refinement
        for _ in 0..self.max_iterations {
            let mut accum_l = vec![0.0; actual_k];
            let mut accum_a = vec![0.0; actual_k];
            let mut accum_b = vec![0.0; actual_k];
            cluster_counts.fill(0);

            for &p in &sampled {
                let mut best_idx = 0;
                let mut best_dist = f64::INFINITY;

                for (idx, c) in centroids.iter().enumerate() {
                    let d = self.oklab_distance(&p, c);
                    if d < best_dist {
                        best_dist = d;
                        best_idx = idx;
                    }
                }

                let a = p.c * p.h.to_radians().cos();
                let b = p.c * p.h.to_radians().sin();

                accum_l[best_idx] += p.l;
                accum_a[best_idx] += a;
                accum_b[best_idx] += b;
                cluster_counts[best_idx] += 1;
            }

            let mut max_shift = 0.0f64;
            for i in 0..actual_k {
                if cluster_counts[i] == 0 {
                    continue;
                }
                let count = cluster_counts[i] as f64;
                let new_l = accum_l[i] / count;
                let new_a = accum_a[i] / count;
                let new_b = accum_b[i] / count;

                let new_c = (new_a.powi(2) + new_b.powi(2)).sqrt();
                let mut new_h = new_b.atan2(new_a).to_degrees();
                if new_h < 0.0 {
                    new_h += 360.0;
                }

                let updated = Oklch { l: new_l, c: new_c, h: new_h };
                let shift = self.oklab_distance(&centroids[i], &updated);
                if shift > max_shift {
                    max_shift = shift;
                }
                centroids[i] = updated;
            }

            if max_shift < self.tolerance {
                break;
            }
        }

        let total_samples = sampled.len() as f64;
        let mut results: Vec<ColorCluster> = centroids
            .into_iter()
            .enumerate()
            .map(|(idx, center)| {
                let rgb = oklch_to_srgb(&center);
                ColorCluster {
                    center,
                    weight: cluster_counts[idx] as f64 / total_samples,
                    hex: rgb.to_hex(),
                }
            })
            .collect();

        // Sort descending by cluster weight
        results.sort_by(|a, b| b.weight.partial_cmp(&a.weight).unwrap_or(std::cmp::Ordering::Equal));
        results
    }

    #[inline]
    fn oklab_distance(&self, c1: &Oklch, c2: &Oklch) -> f64 {
        let a1 = c1.c * c1.h.to_radians().cos();
        let b1 = c1.c * c1.h.to_radians().sin();
        let a2 = c2.c * c2.h.to_radians().cos();
        let b2 = c2.c * c2.h.to_radians().sin();

        let dl = c1.l - c2.l;
        let da = a1 - a2;
        let db = b1 - b2;

        (dl * dl + da * da + db * db).sqrt()
    }
}
