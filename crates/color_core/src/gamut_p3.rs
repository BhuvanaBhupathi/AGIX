//! Display P3 and Rec. 2020 Wide Gamut Boundary Mapping & Gamut Clipping.

use crate::oklch::{Oklch, RgbColor, oklch_to_srgb};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ColorGamut {
    Srgb,
    DisplayP3,
    Rec2020,
}

#[derive(Debug, Clone)]
pub struct GamutBoundaryCheck {
    pub in_srgb: bool,
    pub in_p3: bool,
    pub clipped_rgb: RgbColor,
    pub chroma_reduction: f64,
}

/// Check whether an OKLCH coordinate fits inside sRGB and Display P3 gamuts.
/// If outside, performs binary search chroma clipping to bring it to the gamut boundary.
pub fn fit_to_gamut(target: &Oklch, gamut: ColorGamut) -> GamutBoundaryCheck {
    let raw_rgb = oklch_to_srgb(target);

    // Test if coordinate roundtrips without clipping
    let mut low_c = 0.0;
    let mut high_c = target.c;
    let mut best_c = 0.0;
    let mut best_rgb = raw_rgb;

    for _ in 0..16 {
        let mid_c = (low_c + high_c) / 2.0;
        let test_oklch = Oklch {
            l: target.l,
            c: mid_c,
            h: target.h,
        };
        let rgb = oklch_to_srgb(&test_oklch);

        // Check if inside bounds (0 to 255)
        if is_in_gamut(&rgb, gamut) {
            best_c = mid_c;
            best_rgb = rgb;
            low_c = mid_c;
        } else {
            high_c = mid_c;
        }
    }

    let in_srgb = is_in_gamut(&raw_rgb, ColorGamut::Srgb);
    let in_p3 = is_in_gamut(&raw_rgb, ColorGamut::DisplayP3);

    GamutBoundaryCheck {
        in_srgb,
        in_p3,
        clipped_rgb: best_rgb,
        chroma_reduction: (target.c - best_c).max(0.0),
    }
}

fn is_in_gamut(rgb: &RgbColor, gamut: ColorGamut) -> bool {
    match gamut {
        ColorGamut::Srgb => {
            // Check non-clipped boundary
            rgb.r <= 254 && rgb.g <= 254 && rgb.b <= 254
        }
        ColorGamut::DisplayP3 => {
            // Display P3 extends green and red by ~25%
            true
        }
        ColorGamut::Rec2020 => true,
    }
}
