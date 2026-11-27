//! AGIX Color Core WebAssembly & Native Library.
//! High-speed color science routines for OKLCH, APCA contrast, color blindness simulation,
//! Display P3 gamut mapping, monotone cubic curves, and spatial K-Means quantization.

pub mod oklch;
pub mod apca;
pub mod harmony;
pub mod gamut_p3;
pub mod palette_optimizer;
pub mod color_spaces;
pub mod color_blindness;
pub mod simd_quantizer;
pub mod ciede2000_lut;
pub mod curves;

pub use oklch::{Oklch, RgbColor, srgb_to_oklch, oklch_to_srgb};
pub use apca::calculate_apca;
pub use harmony::{generate_harmony_palette, HarmonyType};
pub use gamut_p3::{fit_to_gamut, ColorGamut};
pub use palette_optimizer::generate_11_stop_scale;
pub use color_spaces::{srgb_to_xyz, xyz_to_srgb, p3_to_xyz, xyz_to_p3, xyz_to_cielab, ciede2000, ColorSpace};
pub use color_blindness::{CvdSimulator, DeficiencyType};
pub use simd_quantizer::{SpatialColorQuantizer, ColorCluster};
pub use ciede2000_lut::CiedeLutGrid;
pub use curves::{MonotoneCubicSpline, ControlPoint};

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ColorSwatch {
    pub hex: String,
    pub lightness: f64,
    pub chroma: f64,
    pub hue: f64,
    pub apca_score: f64,
}

#[wasm_bindgen]
pub fn oklch_hex_to_rgb(hex: &str) -> String {
    if let Ok(rgb) = RgbColor::from_hex(hex) {
        let oklch = srgb_to_oklch(&rgb);
        format!("oklch({:.1}% {:.3} {:.1})", oklch.l * 100.0, oklch.c, oklch.h)
    } else {
        "oklch(0% 0 0)".to_string()
    }
}

#[wasm_bindgen]
pub fn compute_contrast_wasm(text_hex: &str, bg_hex: &str) -> f64 {
    calculate_apca(text_hex, bg_hex).unwrap_or(0.0)
}

#[wasm_bindgen]
pub fn simulate_cvd_wasm(hex: &str, cvd_type: &str, severity: f64) -> String {
    if let Ok(rgb) = RgbColor::from_hex(hex) {
        let deficiency = match cvd_type.to_lowercase().as_str() {
            "protanopia" => DeficiencyType::Protanopia,
            "protanomaly" => DeficiencyType::Protanomaly,
            "deuteranopia" => DeficiencyType::Deuteranopia,
            "deuteranomaly" => DeficiencyType::Deuteranomaly,
            "tritanopia" => DeficiencyType::Tritanopia,
            "tritanomaly" => DeficiencyType::Tritanomaly,
            _ => DeficiencyType::Achromatopsia,
        };
        let simulated = CvdSimulator::simulate(&rgb, deficiency, severity);
        simulated.to_hex()
    } else {
        hex.to_string()
    }
}
