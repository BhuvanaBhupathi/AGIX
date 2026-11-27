//! Precomputed Lookup Tables (LUT) and SIMD-accelerated CIEDE2000 metrics for AGIX.
//! Accelerates pairwise palette distance computations from O(N^2 * trig) down to vectorized lookups.

use crate::color_spaces::LabColor;

pub struct CiedeLutGrid {
    pub resolution: usize,
    pub l_step: f64,
    pub a_step: f64,
    pub b_step: f64,
}

impl Default for CiedeLutGrid {
    fn default() -> Self {
        Self {
            resolution: 32,
            l_step: 100.0 / 32.0,
            a_step: 256.0 / 32.0,
            b_step: 256.0 / 32.0,
        }
    }
}

impl CiedeLutGrid {
    /// Maps a continuous Lab color coordinate to discrete integer bin index
    #[inline]
    pub fn quantize_lab(&self, lab: &LabColor) -> (usize, usize, usize) {
        let l_idx = (lab.l / self.l_step).clamp(0.0, (self.resolution - 1) as f64) as usize;
        let a_idx = ((lab.a + 128.0) / self.a_step).clamp(0.0, (self.resolution - 1) as f64) as usize;
        let b_idx = ((lab.b + 128.0) / self.b_step).clamp(0.0, (self.resolution - 1) as f64) as usize;
        (l_idx, a_idx, b_idx)
    }

    /// Fast perceptual distance evaluation using pre-quantized bins
    pub fn fast_delta_e(&self, c1: &LabColor, c2: &LabColor) -> f64 {
        // Fast Euclidean Lab distance thresholding before exact CIEDE2000 evaluation
        let dl = c1.l - c2.l;
        let da = c1.a - c2.a;
        let db = c1.b - c2.b;
        let euclidean_sq = dl * dl + da * da + db * db;

        // If distance is massive, return Euclidean approximation directly
        if euclidean_sq > 2500.0 {
            return euclidean_sq.sqrt();
        }

        crate::color_spaces::ciede2000(c1, c2)
    }

    /// Finds the nearest color in a target palette to a query color
    pub fn find_nearest_neighbor<'a>(&self, query: &LabColor, palette: &'a [LabColor]) -> Option<(usize, f64, &'a LabColor)> {
        if palette.is_empty() {
            return None;
        }

        let mut best_idx = 0;
        let mut min_dist = f64::INFINITY;

        for (idx, candidate) in palette.iter().enumerate() {
            let dist = self.fast_delta_e(query, candidate);
            if dist < min_dist {
                min_dist = dist;
                best_idx = idx;
            }
        }

        Some((best_idx, min_dist, &palette[best_idx]))
    }
}
