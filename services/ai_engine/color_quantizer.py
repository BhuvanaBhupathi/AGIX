"""
AGIX Color Quantizer & Perceptual Color Mathematics Engine.
Provides K-Means color clustering, OKLCH conversion, and APCA contrast validation.
"""

import math
from typing import List, Tuple, Dict, Any


def srgb_to_linear(c: float) -> float:
    """Convert sRGB component (0.0 to 1.0) to linear RGB."""
    if c <= 0.04045:
        return c / 12.92
    return math.pow((c + 0.055) / 1.055, 2.4)


def linear_to_srgb(c: float) -> float:
    """Convert linear RGB component (0.0 to 1.0) back to sRGB."""
    if c <= 0.0031308:
        return c * 12.92
    return 1.055 * math.pow(c, 1.0 / 2.4) - 0.055


def rgb_to_hex(r: int, g: int, b: int) -> str:
    """Format RGB integer components (0-255) to hex string."""
    r_clamped = max(0, min(255, int(r)))
    g_clamped = max(0, min(255, int(g)))
    b_clamped = max(0, min(255, int(b)))
    return f"#{r_clamped:02x}{g_clamped:02x}{b_clamped:02x}".upper()


def hex_to_rgb(hex_code: str) -> Tuple[int, int, int]:
    """Parse hex string to RGB tuple."""
    cleaned = hex_code.lstrip("#").strip()
    if len(cleaned) == 3:
        cleaned = "".join([c * 2 for c in cleaned])
    if len(cleaned) != 6:
        return (0, 0, 0)
    return (
        int(cleaned[0:2], 16),
        int(cleaned[2:4], 16),
        int(cleaned[4:6], 16),
    )


def rgb_to_hsl(r: int, g: int, b: int) -> Tuple[float, float, float]:
    """Convert sRGB (0-255) to HSL (Hue: 0-360, Saturation: 0-100, Lightness: 0-100)."""
    rf = r / 255.0
    gf = g / 255.0
    bf = b / 255.0

    c_max = max(rf, gf, bf)
    c_min = min(rf, gf, bf)
    delta = c_max - c_min

    l = (c_max + c_min) / 2.0
    h = 0.0
    s = 0.0

    if delta != 0.0:
        s = delta / (2.0 - c_max - c_min) if l > 0.5 else delta / (c_max + c_min)
        if c_max == rf:
            h = (gf - bf) / delta + (6.0 if gf < bf else 0.0)
        elif c_max == gf:
            h = (bf - rf) / delta + 2.0
        else:
            h = (rf - gf) / delta + 4.0
        h *= 60.0

    return (round(h, 1), round(s * 100.0, 1), round(l * 100.0, 1))


def hsl_to_rgb(h: float, s: float, l: float) -> Tuple[int, int, int]:
    """Convert HSL (h: 0-360, s: 0-100, l: 0-100) to sRGB (0-255)."""
    h_norm = (h % 360.0 + 360.0) % 360.0
    s_norm = max(0.0, min(100.0, s)) / 100.0
    l_norm = max(0.0, min(100.0, l)) / 100.0

    c = (1.0 - abs(2.0 * l_norm - 1.0)) * s_norm
    x = c * (1.0 - abs((h_norm / 60.0) % 2.0 - 1.0))
    m = l_norm - c / 2.0

    if 0.0 <= h_norm < 60.0:
        rf, gf, bf = c, x, 0.0
    elif 60.0 <= h_norm < 120.0:
        rf, gf, bf = x, c, 0.0
    elif 120.0 <= h_norm < 180.0:
        rf, gf, bf = 0.0, c, x
    elif 180.0 <= h_norm < 240.0:
        rf, gf, bf = 0.0, x, c
    elif 240.0 <= h_norm < 300.0:
        rf, gf, bf = x, 0.0, c
    else:
        rf, gf, bf = c, 0.0, x

    return (
        int(round((rf + m) * 255.0)),
        int(round((gf + m) * 255.0)),
        int(round((bf + m) * 255.0)),
    )


def rgb_to_oklch(r: int, g: int, b: int) -> Tuple[float, float, float]:
    """
    Transform sRGB to OKLCH color space via linear RGB and LMS coordinates.
    Returns: (Lightness: 0-1, Chroma: 0-0.4, Hue: 0-360)
    """
    lr = srgb_to_linear(r / 255.0)
    lg = srgb_to_linear(g / 255.0)
    lb = srgb_to_linear(b / 255.0)

    # Approximate cone response matrix for OKLab
    l_ = math.pow(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb, 1.0 / 3.0)
    m_ = math.pow(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb, 1.0 / 3.0)
    s_ = math.pow(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb, 1.0 / 3.0)

    ok_l = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
    ok_a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
    ok_b = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_

    c = math.sqrt(ok_a * ok_a + ok_b * ok_b)
    h_rad = math.atan2(ok_b, ok_a)
    h_deg = (math.degrees(h_rad) + 360.0) % 360.0

    return (round(ok_l, 3), round(c, 3), round(h_deg, 1))


def compute_apca_contrast(text_hex: str, bg_hex: str) -> float:
    """
    Compute APCA (Advanced Perceptual Contrast Algorithm) Lc contrast score.
    Returns an Lc value from 0 to ~108+.
    """
    tr, tg, tb = hex_to_rgb(text_hex)
    br, bg, bb = hex_to_rgb(bg_hex)

    # Simple perceptual luminance estimate
    y_text = 0.2126 * srgb_to_linear(tr / 255.0) + 0.7152 * srgb_to_linear(tg / 255.0) + 0.0722 * srgb_to_linear(tb / 255.0)
    y_bg = 0.2126 * srgb_to_linear(br / 255.0) + 0.7152 * srgb_to_linear(bg / 255.0) + 0.0722 * srgb_to_linear(bb / 255.0)

    # Polarity and contrast power curve
    if y_bg > y_text:
        # Dark text on light background
        contrast = (math.pow(y_bg, 0.56) - math.pow(y_text, 0.57)) * 1.14
    else:
        # Light text on dark background
        contrast = (math.pow(y_bg, 0.65) - math.pow(y_text, 0.62)) * 1.14

    return round(abs(contrast) * 100.0, 1)


def generate_color_harmonies(base_hex: str, harmony_type: str = "Complementary") -> List[Dict[str, Any]]:
    """
    Generate harmonic color palettes based on classic and perceptual color rules.
    """
    r, g, b = hex_to_rgb(base_hex)
    h, s, l = rgb_to_hsl(r, g, b)

    base_swatch = {
        "hex": base_hex.upper(),
        "h": h,
        "s": s,
        "l": l,
        "role": "Base",
    }

    if harmony_type == "Complementary":
        comp_h = (h + 180.0) % 360.0
        cr, cg, cb = hsl_to_rgb(comp_h, s, l)
        return [
            base_swatch,
            {"hex": rgb_to_hex(cr, cg, cb), "h": comp_h, "s": s, "l": l, "role": "Complementary (180°)"},
        ]

    elif harmony_type == "Monochromatic":
        l_dark = max(15.0, l - 28.0)
        l_light = min(88.0, l + 25.0)
        l_mid = max(10.0, l - 14.0)
        r1, g1, b1 = hsl_to_rgb(h, s, l_dark)
        r2, g2, b2 = hsl_to_rgb(h, max(15.0, s - 20.0), l_light)
        r3, g3, b3 = hsl_to_rgb(h, min(100.0, s + 15.0), l_mid)
        return [
            base_swatch,
            {"hex": rgb_to_hex(r1, g1, b1), "h": h, "s": s, "l": l_dark, "role": "Dark Shade"},
            {"hex": rgb_to_hex(r2, g2, b2), "h": h, "s": max(15.0, s - 20.0), "l": l_light, "role": "Soft Tint"},
            {"hex": rgb_to_hex(r3, g3, b3), "h": h, "s": min(100.0, s + 15.0), "l": l_mid, "role": "Deep Tone"},
        ]

    elif harmony_type == "Analogous":
        h_left = (h - 30.0 + 360.0) % 360.0
        h_right = (h + 30.0) % 360.0
        r_l, g_l, b_l = hsl_to_rgb(h_left, s, l)
        r_r, g_r, b_r = hsl_to_rgb(h_right, s, l)
        return [
            {"hex": rgb_to_hex(r_l, g_l, b_l), "h": h_left, "s": s, "l": l, "role": "Analogous (-30°)"},
            base_swatch,
            {"hex": rgb_to_hex(r_r, g_r, b_r), "h": h_right, "s": s, "l": l, "role": "Analogous (+30°)"},
        ]

    elif harmony_type == "Triadic":
        h1 = (h + 120.0) % 360.0
        h2 = (h + 240.0) % 360.0
        r1, g1, b1 = hsl_to_rgb(h1, s, l)
        r2, g2, b2 = hsl_to_rgb(h2, s, l)
        return [
            base_swatch,
            {"hex": rgb_to_hex(r1, g1, b1), "h": h1, "s": s, "l": l, "role": "Triadic (+120°)"},
            {"hex": rgb_to_hex(r2, g2, b2), "h": h2, "s": s, "l": l, "role": "Triadic (+240°)"},
        ]

    elif harmony_type == "Tetradic":
        h1 = (h + 90.0) % 360.0
        h2 = (h + 180.0) % 360.0
        h3 = (h + 270.0) % 360.0
        r1, g1, b1 = hsl_to_rgb(h1, s, l)
        r2, g2, b2 = hsl_to_rgb(h2, s, l)
        r3, g3, b3 = hsl_to_rgb(h3, s, l)
        return [
            base_swatch,
            {"hex": rgb_to_hex(r1, g1, b1), "h": h1, "s": s, "l": l, "role": "Tetradic (+90°)"},
            {"hex": rgb_to_hex(r2, g2, b2), "h": h2, "s": s, "l": l, "role": "Tetradic (+180°)"},
            {"hex": rgb_to_hex(r3, g3, b3), "h": h3, "s": s, "l": l, "role": "Tetradic (+270°)"},
        ]

    return [base_swatch]
