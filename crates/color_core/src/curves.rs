//! Monotone Cubic Spline and Perceptual Bezier curve generators for AGIX.
//! Computes smooth, non-oscillating lightness and chroma interpolation curves across 11 stops.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct ControlPoint {
    pub t: f64, // Normalized step (0.0 to 1.0)
    pub val: f64,
}

/// Monotone Cubic Spline (Fritsch-Carlson algorithm) to prevent overshoot in lightness ramps
pub struct MonotoneCubicSpline {
    xs: Vec<f64>,
    ys: Vec<f64>,
    ms: Vec<f64>,
}

impl MonotoneCubicSpline {
    pub fn new(points: &[ControlPoint]) -> Option<Self> {
        let n = points.len();
        if n < 2 {
            return None;
        }

        let mut xs = Vec::with_capacity(n);
        let mut ys = Vec::with_capacity(n);
        for p in points {
            xs.push(p.t);
            ys.push(p.val);
        }

        let mut dxs = vec![0.0; n - 1];
        let mut dys = vec![0.0; n - 1];
        let mut secants = vec![0.0; n - 1];

        for i in 0..(n - 1) {
            let dx = xs[i + 1] - xs[i];
            let dy = ys[i + 1] - ys[i];
            dxs[i] = dx;
            dys[i] = dy;
            secants[i] = dy / dx;
        }

        let mut ms = vec![0.0; n];
        ms[0] = secants[0];
        for i in 1..(n - 1) {
            ms[i] = (secants[i - 1] + secants[i]) * 0.5;
        }
        ms[n - 1] = secants[n - 2];

        // Fritsch-Carlson constraints to guarantee monotonicity
        for i in 0..(n - 1) {
            if dys[i] == 0.0 {
                ms[i] = 0.0;
                ms[i + 1] = 0.0;
            } else {
                let alpha = ms[i] / secants[i];
                let beta = ms[i + 1] / secants[i];
                let dist = alpha.powi(2) + beta.powi(2);
                if dist > 9.0 {
                    let tau = 3.0 / dist.sqrt();
                    ms[i] = tau * alpha * secants[i];
                    ms[i + 1] = tau * beta * secants[i];
                }
            }
        }

        Some(Self { xs, ys, ms })
    }

    /// Evaluates interpolated value at position x
    pub fn interpolate(&self, x: f64) -> f64 {
        let n = self.xs.len();
        if x <= self.xs[0] {
            return self.ys[0];
        }
        if x >= self.xs[n - 1] {
            return self.ys[n - 1];
        }

        let mut low = 0;
        let mut high = n - 1;
        while low <= high {
            let mid = (low + high) / 2;
            if self.xs[mid] <= x {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        let i = high.max(0).min(n - 2);

        let h = self.xs[i + 1] - self.xs[i];
        let t = (x - self.xs[i]) / h;
        let t2 = t * t;
        let t3 = t2 * t;

        let h00 = 2.0 * t3 - 3.0 * t2 + 1.0;
        let h10 = t3 - 2.0 * t2 + t;
        let h01 = -2.0 * t3 + 3.0 * t2;
        let h11 = t3 - t2;

        h00 * self.ys[i] + h10 * h * self.ms[i] + h01 * self.ys[i + 1] + h11 * h * self.ms[i + 1]
    }
}
