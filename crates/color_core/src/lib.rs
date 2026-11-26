//! AGIX Color Core WebAssembly & Native Library.
//! High-speed color science routines for OKLCH, APCA contrast, and harmonic palettes.

pub mod oklch;
pub mod apca;
pub mod harmony;

pub use oklch::{Oklch, RgbColor, srgb_to_oklch, oklch_to_srgb};
pub use apca::calculate_apca;
pub use harmony::{generate_harmony_palette, HarmonyType};

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
