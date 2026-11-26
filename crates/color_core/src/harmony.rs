//! Harmonic Color Wheel generator in Rust.

use crate::oklch::{Oklch, RgbColor, oklch_to_srgb, srgb_to_oklch};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum HarmonyType {
    Complementary,
    Monochromatic,
    Analogous,
    Triadic,
    Tetradic,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HarmonicSwatch {
    pub hex: String,
    pub role: String,
    pub hue_degrees: f64,
}

pub fn generate_harmony_palette(base_hex: &str, harmony: HarmonyType) -> Vec<HarmonicSwatch> {
    let base_rgb = match RgbColor::from_hex(base_hex) {
        Ok(c) => c,
        Err(_) => RgbColor::new(114, 125, 141),
    };
    let base_oklch = srgb_to_oklch(&base_rgb);

    let mut swatches = Vec::new();
    swatches.push(HarmonicSwatch {
        hex: base_rgb.to_hex(),
        role: "Base".to_string(),
        hue_degrees: base_oklch.h,
    });

    match harmony {
        HarmonyType::Complementary => {
            let comp_h = (base_oklch.h + 180.0) % 360.0;
            let comp_color = oklch_to_srgb(&Oklch {
                l: base_oklch.l,
                c: base_oklch.c,
                h: comp_h,
            });
            swatches.push(HarmonicSwatch {
                hex: comp_color.to_hex(),
                role: "Complementary (180°)".to_string(),
                hue_degrees: comp_h,
            });
        }
        HarmonyType::Monochromatic => {
            let dark = oklch_to_srgb(&Oklch {
                l: (base_oklch.l - 0.25).clamp(0.1, 0.9),
                c: base_oklch.c,
                h: base_oklch.h,
            });
            let light = oklch_to_srgb(&Oklch {
                l: (base_oklch.l + 0.22).clamp(0.1, 0.95),
                c: (base_oklch.c * 0.7).clamp(0.01, 0.3),
                h: base_oklch.h,
            });
            swatches.push(HarmonicSwatch {
                hex: dark.to_hex(),
                role: "Dark Shade".to_string(),
                hue_degrees: base_oklch.h,
            });
            swatches.push(HarmonicSwatch {
                hex: light.to_hex(),
                role: "Soft Tint".to_string(),
                hue_degrees: base_oklch.h,
            });
        }
        HarmonyType::Analogous => {
            let left_h = (base_oklch.h - 30.0 + 360.0) % 360.0;
            let right_h = (base_oklch.h + 30.0) % 360.0;
            let left_rgb = oklch_to_srgb(&Oklch { l: base_oklch.l, c: base_oklch.c, h: left_h });
            let right_rgb = oklch_to_srgb(&Oklch { l: base_oklch.l, c: base_oklch.c, h: right_h });
            swatches.insert(0, HarmonicSwatch {
                hex: left_rgb.to_hex(),
                role: "Analogous (-30°)".to_string(),
                hue_degrees: left_h,
            });
            swatches.push(HarmonicSwatch {
                hex: right_rgb.to_hex(),
                role: "Analogous (+30°)".to_string(),
                hue_degrees: right_h,
            });
        }
        HarmonyType::Triadic => {
            let h1 = (base_oklch.h + 120.0) % 360.0;
            let h2 = (base_oklch.h + 240.0) % 360.0;
            let rgb1 = oklch_to_srgb(&Oklch { l: base_oklch.l, c: base_oklch.c, h: h1 });
            let rgb2 = oklch_to_srgb(&Oklch { l: base_oklch.l, c: base_oklch.c, h: h2 });
            swatches.push(HarmonicSwatch {
                hex: rgb1.to_hex(),
                role: "Triadic (+120°)".to_string(),
                hue_degrees: h1,
            });
            swatches.push(HarmonicSwatch {
                hex: rgb2.to_hex(),
                role: "Triadic (+240°)".to_string(),
                hue_degrees: h2,
            });
        }
        HarmonyType::Tetradic => {
            for step in [90.0, 180.0, 270.0] {
                let h = (base_oklch.h + step) % 360.0;
                let rgb = oklch_to_srgb(&Oklch { l: base_oklch.l, c: base_oklch.c, h });
                swatches.push(HarmonicSwatch {
                    hex: rgb.to_hex(),
                    role: format!("Tetradic (+{:.0}°)", step),
                    hue_degrees: h,
                });
            }
        }
    }

    swatches
}
