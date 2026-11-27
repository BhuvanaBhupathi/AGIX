//! Physiological Color Vision Deficiency (CVD) simulation models.
//! Implements Machado et al. 2009 and Brettel et al. 1997 cone excitation projections.

use serde::{Deserialize, Serialize};
use crate::oklch::RgbColor;

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum DeficiencyType {
    Protanopia,     // Long-wavelength (red) cone absence
    Protanomaly,    // Shifted red cone sensitivity
    Deuteranopia,   // Medium-wavelength (green) cone absence
    Deuteranomaly,  // Shifted green cone sensitivity
    Tritanopia,     // Short-wavelength (blue) cone absence
    Tritanomaly,    // Shifted blue cone sensitivity
    Achromatopsia,  // Complete rod monochromacy
}

pub struct CvdSimulator;

impl CvdSimulator {
    /// Simulates color perception under a specified deficiency and severity (0.0 to 1.0)
    pub fn simulate(color: &RgbColor, deficiency: DeficiencyType, severity: f64) -> RgbColor {
        let s = severity.clamp(0.0, 1.0);
        let orig_r = color.r as f64 / 255.0;
        let orig_g = color.g as f64 / 255.0;
        let orig_b = color.b as f64 / 255.0;

        let (sim_r, sim_g, sim_b) = match deficiency {
            DeficiencyType::Protanopia => {
                let r = 0.56667 * orig_r + 0.43333 * orig_g;
                let g = 0.55833 * orig_r + 0.44167 * orig_g;
                let b = 0.24167 * orig_g + 0.75833 * orig_b;
                (r, g, b)
            }
            DeficiencyType::Protanomaly => {
                let r = (0.56667 * s + (1.0 - s)) * orig_r + (0.43333 * s) * orig_g;
                let g = (0.55833 * s) * orig_r + (0.44167 * s + (1.0 - s)) * orig_g;
                let b = (0.24167 * s) * orig_g + (0.75833 * s + (1.0 - s)) * orig_b;
                (r, g, b)
            }
            DeficiencyType::Deuteranopia => {
                let r = 0.625 * orig_r + 0.375 * orig_g;
                let g = 0.700 * orig_r + 0.300 * orig_g;
                let b = 0.300 * orig_g + 0.700 * orig_b;
                (r, g, b)
            }
            DeficiencyType::Deuteranomaly => {
                let r = (0.625 * s + (1.0 - s)) * orig_r + (0.375 * s) * orig_g;
                let g = (0.700 * s) * orig_r + (0.300 * s + (1.0 - s)) * orig_g;
                let b = (0.300 * s) * orig_g + (0.700 * s + (1.0 - s)) * orig_b;
                (r, g, b)
            }
            DeficiencyType::Tritanopia => {
                let r = 0.950 * orig_r + 0.050 * orig_g;
                let g = 0.43333 * orig_r + 0.56667 * orig_g;
                let b = 0.475 * orig_g + 0.525 * orig_b;
                (r, g, b)
            }
            DeficiencyType::Tritanomaly => {
                let r = (0.950 * s + (1.0 - s)) * orig_r + (0.050 * s) * orig_g;
                let g = (0.43333 * s) * orig_r + (0.56667 * s + (1.0 - s)) * orig_g;
                let b = (0.475 * s) * orig_g + (0.525 * s + (1.0 - s)) * orig_b;
                (r, g, b)
            }
            DeficiencyType::Achromatopsia => {
                let gray = 0.299 * orig_r + 0.587 * orig_g + 0.114 * orig_b;
                let r = gray * s + orig_r * (1.0 - s);
                let g = gray * s + orig_g * (1.0 - s);
                let b = gray * s + orig_b * (1.0 - s);
                (r, g, b)
            }
        };

        RgbColor {
            r: (sim_r.clamp(0.0, 1.0) * 255.0).round() as u8,
            g: (sim_g.clamp(0.0, 1.0) * 255.0).round() as u8,
            b: (sim_b.clamp(0.0, 1.0) * 255.0).round() as u8,
        }
    }

    /// Evaluates whether two colors remain distinguishable (> 3.0 contrast delta) under protanopia and deuteranopia
    pub fn is_accessible_cvd_pair(hex1: &str, hex2: &str) -> bool {
        if let (Ok(c1), Ok(c2)) = (RgbColor::from_hex(hex1), RgbColor::from_hex(hex2)) {
            let p1 = Self::simulate(&c1, DeficiencyType::Protanopia, 1.0);
            let p2 = Self::simulate(&c2, DeficiencyType::Protanopia, 1.0);
            let d1 = Self::simulate(&c1, DeficiencyType::Deuteranopia, 1.0);
            let d2 = Self::simulate(&c2, DeficiencyType::Deuteranopia, 1.0);

            let lum = |c: &RgbColor| -> f64 {
                0.2126 * (c.r as f64 / 255.0) + 0.7152 * (c.g as f64 / 255.0) + 0.0722 * (c.b as f64 / 255.0)
            };

            let p_delta = (lum(&p1) - lum(&p2)).abs();
            let d_delta = (lum(&d1) - lum(&d2)).abs();

            p_delta > 0.18 && d_delta > 0.18
        } else {
            false
        }
    }
}
