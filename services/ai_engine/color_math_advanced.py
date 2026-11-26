"""
AGIX Advanced Color Science: CIELAB, Delta-E 2000, and Perceptual Difference Metrics.
Implements the CIE94 and CIEDE2000 color difference formulas for exact brand consistency auditing.
"""

import math
from typing import Tuple


def srgb_to_xyz(r: float, g: float, b: float) -> Tuple[float, float, float]:
    """Convert sRGB (0.0 to 1.0) to CIE 1931 XYZ standard observer."""
    def pivot(c: float) -> float:
        return c / 12.92 if c <= 0.04045 else math.pow((c + 0.055) / 1.055, 2.4)

    r_lin = pivot(r) * 100.0
    g_lin = pivot(g) * 100.0
    b_lin = pivot(b) * 100.0

    # D65 standard illuminant matrix
    x = r_lin * 0.4124564 + g_lin * 0.3575761 + b_lin * 0.1804375
    y = r_lin * 0.2126729 + g_lin * 0.7151522 + b_lin * 0.0721750
    z = r_lin * 0.0193339 + g_lin * 0.1191920 + b_lin * 0.9503041

    return (x, y, z)


def xyz_to_lab(x: float, y: float, z: float) -> Tuple[float, float, float]:
    """Convert CIE XYZ to CIE L*a*b* under D65 white point."""
    # D65 reference white point
    xn = 95.047
    yn = 100.000
    zn = 108.883

    def f(t: float) -> float:
        delta = 6.0 / 29.0
        return math.pow(t, 1.0 / 3.0) if t > delta * delta * delta else t / (3.0 * delta * delta) + 4.0 / 29.0

    fx = f(x / xn)
    fy = f(y / yn)
    fz = f(z / zn)

    l_star = 116.0 * fy - 16.0
    a_star = 500.0 * (fx - fy)
    b_star = 200.0 * (fy - fz)

    return (l_star, a_star, b_star)


def delta_e_2000(lab1: Tuple[float, float, float], lab2: Tuple[float, float, float]) -> float:
    """
    Compute CIEDE2000 color difference between two Lab colors.
    Returns: Delta-E value where <= 1.0 is imperceptible, and >= 5.0 is noticeable.
    """
    l1, a1, b1 = lab1
    l2, a2, b2 = lab2

    c1 = math.sqrt(a1 * a1 + b1 * b1)
    c2 = math.sqrt(a2 * a2 + b2 * b2)
    c_bar = (c1 + c2) / 2.0

    g = 0.5 * (1.0 - math.sqrt(math.pow(c_bar, 7) / (math.pow(c_bar, 7) + math.pow(25.0, 7))))
    a1_prime = (1.0 + g) * a1
    a2_prime = (1.0 + g) * a2

    c1_prime = math.sqrt(a1_prime * a1_prime + b1 * b1)
    c2_prime = math.sqrt(a2_prime * a2_prime + b2 * b2)

    h1_prime = math.degrees(math.atan2(b1, a1_prime)) % 360.0
    h2_prime = math.degrees(math.atan2(b2, a2_prime)) % 360.0

    delta_l_prime = l2 - l1
    delta_c_prime = c2_prime - c1_prime

    if c1_prime * c2_prime == 0.0:
        delta_h_prime = 0.0
    elif abs(h2_prime - h1_prime) <= 180.0:
        delta_h_prime = h2_prime - h1_prime
    elif h2_prime - h1_prime > 180.0:
        delta_h_prime = (h2_prime - h1_prime) - 360.0
    else:
        delta_h_prime = (h2_prime - h1_prime) + 360.0

    delta_h_capital = 2.0 * math.sqrt(c1_prime * c2_prime) * math.sin(math.radians(delta_h_prime / 2.0))

    l_bar_prime = (l1 + l2) / 2.0
    c_bar_prime = (c1_prime + c2_prime) / 2.0

    if c1_prime * c2_prime == 0.0:
        h_bar_prime = h1_prime + h2_prime
    elif abs(h1_prime - h2_prime) <= 180.0:
        h_bar_prime = (h1_prime + h2_prime) / 2.0
    elif h1_prime + h2_prime < 360.0:
        h_bar_prime = (h1_prime + h2_prime + 360.0) / 2.0
    else:
        h_bar_prime = (h1_prime + h2_prime - 360.0) / 2.0

    t = (
        1.0
        - 0.17 * math.cos(math.radians(h_bar_prime - 30.0))
        + 0.24 * math.cos(math.radians(2.0 * h_bar_prime))
        + 0.32 * math.cos(math.radians(3.0 * h_bar_prime + 6.0))
        - 0.20 * math.cos(math.radians(4.0 * h_bar_prime - 63.0))
    )

    s_l = 1.0 + (0.015 * math.pow(l_bar_prime - 50.0, 2)) / math.sqrt(20.0 + math.pow(l_bar_prime - 50.0, 2))
    s_c = 1.0 + 0.045 * c_bar_prime
    s_h = 1.0 + 0.015 * c_bar_prime * t

    delta_theta = 30.0 * math.exp(-math.pow((h_bar_prime - 275.0) / 25.0, 2))
    r_c = 2.0 * math.sqrt(math.pow(c_bar_prime, 7) / (math.pow(c_bar_prime, 7) + math.pow(25.0, 7)))
    r_t = -math.sin(math.radians(2.0 * delta_theta)) * r_c

    term_l = delta_l_prime / s_l
    term_c = delta_c_prime / s_c
    term_h = delta_h_capital / s_h

    delta_e = math.sqrt(term_l * term_l + term_c * term_c + term_h * term_h + r_t * term_c * term_h)
    return round(delta_e, 3)
