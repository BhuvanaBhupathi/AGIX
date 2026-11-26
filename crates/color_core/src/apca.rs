//! Advanced Perceptual Contrast Algorithm (APCA) implementation.

use crate::oklch::RgbColor;

/// Calculate perceptual Lc contrast score using APCA-W3 formulas.
pub fn calculate_apca(text_hex: &str, bg_hex: &str) -> Result<f64, &'static str> {
    let txt = RgbColor::from_hex(text_hex)?;
    let bg = RgbColor::from_hex(bg_hex)?;

    let y_txt = luminance_srgb(&txt);
    let y_bg = luminance_srgb(&bg);

    let contrast = if y_bg > y_txt {
        (y_bg.powf(0.56) - y_txt.powf(0.57)) * 1.14
    } else {
        (y_bg.powf(0.65) - y_txt.powf(0.62)) * 1.14
    };

    Ok((contrast.abs() * 100.0).round())
}

fn luminance_srgb(rgb: &RgbColor) -> f64 {
    let r = (rgb.r as f64 / 255.0).powf(2.4);
    let g = (rgb.g as f64 / 255.0).powf(2.4);
    let b = (rgb.b as f64 / 255.0).powf(2.4);
    0.2126729 * r + 0.7151522 * g + 0.0721750 * b
}
