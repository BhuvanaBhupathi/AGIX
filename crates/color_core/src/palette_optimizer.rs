//! Perceptual Contrast & Palette Optimization Engine.

use crate::apca::calculate_apca;
use crate::oklch::{Oklch, oklch_to_srgb, srgb_to_oklch, RgbColor};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StopScaleResult {
    pub stop: u16,
    pub hex: String,
    pub lightness: f64,
    pub chroma: f64,
    pub apca_lc: f64,
    pub is_accessible_body: bool,
    pub is_accessible_headline: bool,
}

pub fn generate_11_stop_scale(base_hex: &str) -> Vec<StopScaleResult> {
    let base_rgb = match RgbColor::from_hex(base_hex) {
        Ok(c) => c,
        Err(_) => RgbColor::new(124, 58, 237),
    };
    let base_oklch = srgb_to_oklch(&base_rgb);

    let stop_defs: [(u16, f64, f64); 11] = [
        (50, 0.971, 0.015),
        (100, 0.947, 0.031),
        (200, 0.898, 0.065),
        (300, 0.821, 0.128),
        (400, 0.717, 0.210),
        (500, 0.654, 0.260),
        (600, 0.591, 0.268),
        (700, 0.525, 0.237),
        (800, 0.458, 0.201),
        (900, 0.408, 0.166),
        (950, 0.282, 0.116),
    ];

    let mut results = Vec::new();
    let white_hex = "#FFFFFF";

    for (stop, l, c_mult) in stop_defs {
        let target_oklch = Oklch {
            l,
            c: c_mult * (base_oklch.c / 0.25).clamp(0.5, 1.4),
            h: base_oklch.h,
        };
        let rgb = oklch_to_srgb(&target_oklch);
        let hex = rgb.to_hex();
        let apca = calculate_apca(&hex, white_hex).unwrap_or(60.0);

        results.push(StopScaleResult {
            stop,
            hex,
            lightness: (l * 100.0).round(),
            chroma: (target_oklch.c * 1000.0).round() / 1000.0,
            apca_lc: apca,
            is_accessible_body: apca >= 75.0,
            is_accessible_headline: apca >= 60.0,
        });
    }

    results
}
