//! Precise matrix color space conversions for AGIX.
//! Supports sRGB, Display P3, Rec. 2020, Adobe RGB (1998), ProPhoto RGB, and CIE XYZ D65/D50.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum ColorSpace {
    Srgb,
    DisplayP3,
    Rec2020,
    AdobeRgb,
    ProPhotoRgb,
    LinearRgb,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct XyzColor {
    pub x: f64,
    pub y: f64,
    pub z: f64,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct LabColor {
    pub l: f64,
    pub a: f64,
    pub b: f64,
}

// Standard illuminant D65 reference white
pub const D65_X: f64 = 0.95047;
pub const D65_Y: f64 = 1.00000;
pub const D65_Z: f64 = 1.08883;

// Standard illuminant D50 reference white (print & graphic arts)
pub const D50_X: f64 = 0.96422;
pub const D50_Y: f64 = 1.00000;
pub const D50_Z: f64 = 0.82521;

/// Bradford Chromatic Adaptation Transform matrix (D65 to D50)
pub const BRADFORD_D65_TO_D50: [[f64; 3]; 3] = [
    [ 1.0478112,  0.0228866, -0.0501270],
    [ 0.0295424,  0.9904844, -0.0170491],
    [-0.0092345,  0.0150436,  0.7521316],
];

/// Linearize sRGB gamma component
#[inline]
pub fn srgb_to_linear(v: f64) -> f64 {
    if v <= 0.04045 {
        v / 12.92
    } else {
        ((v + 0.055) / 1.055).powf(2.4)
    }
}

/// Apply sRGB gamma curve
#[inline]
pub fn linear_to_srgb(v: f64) -> f64 {
    if v <= 0.0031308 {
        v * 12.92
    } else {
        1.055 * v.powf(1.0 / 2.4) - 0.055
    }
}

/// Display P3 transfer curve (identical to sRGB transfer curve, wider primaries)
#[inline]
pub fn p3_to_linear(v: f64) -> f64 {
    srgb_to_linear(v)
}

#[inline]
pub fn linear_to_p3(v: f64) -> f64 {
    linear_to_srgb(v)
}

/// Rec. 2020 transfer function (ITU-R BT.2020-2)
#[inline]
pub fn rec2020_to_linear(v: f64) -> f64 {
    let alpha = 1.09929682680944;
    let beta = 0.018053968510807;
    if v < beta * 4.5 {
        v / 4.5
    } else {
        ((v + alpha - 1.0) / alpha).powf(1.0 / 0.45)
    }
}

#[inline]
pub fn linear_to_rec2020(v: f64) -> f64 {
    let alpha = 1.09929682680944;
    let beta = 0.018053968510807;
    if v < beta {
        v * 4.5
    } else {
        alpha * v.powf(0.45) - (alpha - 1.0)
    }
}

/// Converts normalized sRGB (0.0 to 1.0) to CIE XYZ D65
pub fn srgb_to_xyz(r: f64, g: f64, b: f64) -> XyzColor {
    let r_lin = srgb_to_linear(r);
    let g_lin = srgb_to_linear(g);
    let b_lin = srgb_to_linear(b);

    XyzColor {
        x: r_lin * 0.4124564 + g_lin * 0.3575761 + b_lin * 0.1804375,
        y: r_lin * 0.2126729 + g_lin * 0.7151522 + b_lin * 0.0721750,
        z: r_lin * 0.0193339 + g_lin * 0.1191920 + b_lin * 0.9503041,
    }
}

/// Converts CIE XYZ D65 to normalized sRGB
pub fn xyz_to_srgb(xyz: &XyzColor) -> (f64, f64, f64) {
    let r_lin = xyz.x *  3.2404542 + xyz.y * -1.5371385 + xyz.z * -0.4985314;
    let g_lin = xyz.x * -0.9692660 + xyz.y *  1.8760108 + xyz.z *  0.0415560;
    let b_lin = xyz.x *  0.0556434 + xyz.y * -0.2040259 + xyz.z *  1.0572252;

    (
        linear_to_srgb(r_lin),
        linear_to_srgb(g_lin),
        linear_to_srgb(b_lin),
    )
}

/// Converts normalized Display P3 to CIE XYZ D65
pub fn p3_to_xyz(r: f64, g: f64, b: f64) -> XyzColor {
    let r_lin = p3_to_linear(r);
    let g_lin = p3_to_linear(g);
    let b_lin = p3_to_linear(b);

    XyzColor {
        x: r_lin * 0.4865709 + g_lin * 0.2656677 + b_lin * 0.1982173,
        y: r_lin * 0.2289746 + g_lin * 0.6917393 + b_lin * 0.0792861,
        z: r_lin * 0.0000000 + g_lin * 0.0451134 + b_lin * 1.0439444,
    }
}

/// Converts CIE XYZ D65 to normalized Display P3
pub fn xyz_to_p3(xyz: &XyzColor) -> (f64, f64, f64) {
    let r_lin = xyz.x *  2.4934969 + xyz.y * -0.9313836 + xyz.z * -0.4027108;
    let g_lin = xyz.x * -0.8294890 + xyz.y *  1.7626641 + xyz.z *  0.0236247;
    let b_lin = xyz.x *  0.0358458 + xyz.y * -0.0761724 + xyz.z *  0.9568845;

    (
        linear_to_p3(r_lin),
        linear_to_p3(g_lin),
        linear_to_p3(b_lin),
    )
}

/// Converts CIE XYZ D65 to CIELAB
pub fn xyz_to_cielab(xyz: &XyzColor) -> LabColor {
    let f = |t: f64| -> f64 {
        let delta = 6.0 / 29.0;
        if t > delta.powi(3) {
            t.cbrt()
        } else {
            t / (3.0 * delta * delta) + 4.0 / 29.0
        }
    };

    let fx = f(xyz.x / D65_X);
    let fy = f(xyz.y / D65_Y);
    let fz = f(xyz.z / D65_Z);

    LabColor {
        l: 116.0 * fy - 16.0,
        a: 500.0 * (fx - fy),
        b: 200.0 * (fy - fz),
    }
}

/// Computes CIEDE2000 color difference between two Lab colors
pub fn ciede2000(c1: &LabColor, c2: &LabColor) -> f64 {
    let k_l = 1.0;
    let k_c = 1.0;
    let k_h = 1.0;

    let c_1 = (c1.a.powi(2) + c1.b.powi(2)).sqrt();
    let c_2 = (c2.a.powi(2) + c2.b.powi(2)).sqrt();
    let c_bar = (c_1 + c_2) / 2.0;

    let g = 0.5 * (1.0 - (c_bar.powi(7) / (c_bar.powi(7) + 25.0_f64.powi(7))).sqrt());
    let a_prime_1 = (1.0 + g) * c1.a;
    let a_prime_2 = (1.0 + g) * c2.a;

    let c_prime_1 = (a_prime_1.powi(2) + c1.b.powi(2)).sqrt();
    let c_prime_2 = (a_prime_2.powi(2) + c2.b.powi(2)).sqrt();

    let h_prime = |b: f64, a: f64| -> f64 {
        if b == 0.0 && a == 0.0 {
            0.0
        } else {
            let mut deg = b.atan2(a).to_degrees();
            if deg < 0.0 {
                deg += 360.0;
            }
            deg
        }
    };

    let h_prime_1 = h_prime(c1.b, a_prime_1);
    let h_prime_2 = h_prime(c2.b, a_prime_2);

    let delta_l_prime = c2.l - c1.l;
    let delta_c_prime = c_prime_2 - c_prime_1;

    let mut delta_h_prime = 0.0;
    if c_prime_1 * c_prime_2 != 0.0 {
        let diff = h_prime_2 - h_prime_1;
        if diff.abs() <= 180.0 {
            delta_h_prime = diff;
        } else if diff > 180.0 {
            delta_h_prime = diff - 360.0;
        } else {
            delta_h_prime = diff + 360.0;
        }
    }

    let delta_capital_h = 2.0 * (c_prime_1 * c_prime_2).sqrt() * (delta_h_prime.to_radians() / 2.0).sin();

    let l_bar_prime = (c1.l + c2.l) / 2.0;
    let c_bar_prime = (c_prime_1 + c_prime_2) / 2.0;

    let h_bar_prime = if c_prime_1 * c_prime_2 == 0.0 {
        h_prime_1 + h_prime_2
    } else if (h_prime_1 - h_prime_2).abs() <= 180.0 {
        (h_prime_1 + h_prime_2) / 2.0
    } else if h_prime_1 + h_prime_2 < 360.0 {
        (h_prime_1 + h_prime_2 + 360.0) / 2.0
    } else {
        (h_prime_1 + h_prime_2 - 360.0) / 2.0
    };

    let t = 1.0
        - 0.17 * ((h_bar_prime - 30.0).to_radians()).cos()
        + 0.24 * ((2.0 * h_bar_prime).to_radians()).cos()
        + 0.32 * ((3.0 * h_bar_prime + 6.0).to_radians()).cos()
        - 0.20 * ((4.0 * h_bar_prime - 63.0).to_radians()).cos();

    let s_l = 1.0 + ((0.015 * (l_bar_prime - 50.0).powi(2)) / (20.0 + (l_bar_prime - 50.0).powi(2)).sqrt());
    let s_c = 1.0 + 0.045 * c_bar_prime;
    let s_h = 1.0 + 0.015 * c_bar_prime * t;

    let delta_theta = 30.0 * (-(((h_bar_prime - 275.0) / 25.0).powi(2))).exp();
    let r_c = 2.0 * (c_bar_prime.powi(7) / (c_bar_prime.powi(7) + 25.0_f64.powi(7))).sqrt();
    let r_t = -r_c * (2.0 * delta_theta.to_radians()).sin();

    ((delta_l_prime / (k_l * s_l)).powi(2)
        + (delta_c_prime / (k_c * s_c)).powi(2)
        + (delta_capital_h / (k_h * s_h)).powi(2)
        + r_t * (delta_c_prime / (k_c * s_c)) * (delta_capital_h / (k_h * s_h)))
        .sqrt()
}
