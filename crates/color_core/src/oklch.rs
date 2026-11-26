//! OKLCH Color Space Transformation and Gamut Mapping.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct RgbColor {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct Oklch {
    pub l: f64, // 0.0 to 1.0
    pub c: f64, // 0.0 to ~0.37
    pub h: f64, // 0.0 to 360.0 degrees
}

impl RgbColor {
    pub fn new(r: u8, g: u8, b: u8) -> Self {
        Self { r, g, b }
    }

    pub fn to_hex(&self) -> String {
        format!("#{:02X}{:02X}{:02X}", self.r, self.g, self.b)
    }

    pub fn from_hex(hex: &str) -> Result<Self, &'static str> {
        let clean = hex.trim_start_matches('#');
        if clean.len() != 6 {
            return Err("Invalid hex string length");
        }
        let r = u8::from_str_radix(&clean[0..2], 16).map_err(|_| "Invalid red component")?;
        let g = u8::from_str_radix(&clean[2..4], 16).map_err(|_| "Invalid green component")?;
        let b = u8::from_str_radix(&clean[4..6], 16).map_err(|_| "Invalid blue component")?;
        Ok(Self { r, g, b })
    }
}

fn srgb_to_linear(v: f64) -> f64 {
    if v <= 0.04045 {
        v / 12.92
    } else {
        ((v + 0.055) / 1.055).powf(2.4)
    }
}

fn linear_to_srgb(v: f64) -> f64 {
    if v <= 0.0031308 {
        v * 12.92
    } else {
        1.055 * v.powf(1.0 / 2.4) - 0.055
    }
}

/// Convert standard sRGB to OKLCH.
pub fn srgb_to_oklch(rgb: &RgbColor) -> Oklch {
    let r_lin = srgb_to_linear(rgb.r as f64 / 255.0);
    let g_lin = srgb_to_linear(rgb.g as f64 / 255.0);
    let b_lin = srgb_to_linear(rgb.b as f64 / 255.0);

    let l = (0.4122214708 * r_lin + 0.5363325363 * g_lin + 0.0514459929 * b_lin).cbrt();
    let m = (0.2119034982 * r_lin + 0.6806995451 * g_lin + 0.1073969566 * b_lin).cbrt();
    let s = (0.0883024619 * r_lin + 0.2817188376 * g_lin + 0.6299787005 * b_lin).cbrt();

    let ok_l = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
    let ok_a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
    let ok_b = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;

    let c = (ok_a * ok_a + ok_b * ok_b).sqrt();
    let mut h = ok_b.atan2(ok_a).to_degrees();
    if h < 0.0 {
        h += 360.0;
    }

    Oklch { l: ok_l, c, h }
}

/// Convert OKLCH back to sRGB with boundary clipping.
pub fn oklch_to_srgb(oklch: &Oklch) -> RgbColor {
    let h_rad = oklch.h.to_radians();
    let a = oklch.c * h_rad.cos();
    let b = oklch.c * h_rad.sin();

    let l = (oklch.l + 0.3963377774 * a + 0.2158037573 * b).powi(3);
    let m = (oklch.l - 0.1055613458 * a - 0.0638541728 * b).powi(3);
    let s = (oklch.l - 0.0894841775 * a - 1.2914855480 * b).powi(3);

    let r_lin = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    let g_lin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    let b_lin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

    let r = (linear_to_srgb(r_lin).clamp(0.0, 1.0) * 255.0).round() as u8;
    let g = (linear_to_srgb(g_lin).clamp(0.0, 1.0) * 255.0).round() as u8;
    let b = (linear_to_srgb(b_lin).clamp(0.0, 1.0) * 255.0).round() as u8;

    RgbColor { r, g, b }
}
