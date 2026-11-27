"""
Generative Diffusion Prompt Synthesis Engine for AGIX.
Translates brand DNA attributes, color harmonies, and typography cues into
photorealistic and 3D architectural rendering prompts for Stable Diffusion XL and Midjourney.
"""

from typing import List, Dict, Optional, Any
import random


class DiffusionPrompter:
    """
    Synthesizes rich, hyper-specific visual prompts derived from project brand guidelines.
    """

    LIGHTING_PRESETS: Dict[str, str] = {
        "studio_minimal": "clean softbox studio lighting, diffused caustics, rim light on matte surfaces, 8k octane render",
        "golden_hour_editorial": "dramatic golden hour side-lighting, organic dappled shadows through Monstera foliage, warm film grain",
        "cyber_neon": "deep cyan and ultraviolet volumetric backlight, haze, specular reflections on dark anodized titanium",
        "architectural_ambient": "diffuse overcast natural window daylight, neutral bounce lighting, high architectural precision",
        "luxury_dramatic": "chiaroscuro directional spotlighting, deep velvety shadow falloff, subtle gold leaf specular highlights"
    }

    CAMERA_PRESETS: Dict[str, str] = {
        "macro_product": "shot on Hasselblad H6D-100c, 120mm macro lens, f/4 aperture, microscopic surface tactile texture, tack sharp focus",
        "editorial_portrait": "shot on Leica M11, Noctilux-M 50mm f/0.95 ASPH, shallow depth of field, natural skin texture, Kodak Portra 400 tone",
        "spatial_wide": "architectural photography, tilt-shift 24mm lens, parallel vertical lines, expansive museum negative space",
        "drone_top_down": "flat lay orthographic top-down perspective, perfectly geometric grid arrangement, zero distortion"
    }

    NEGATIVE_MASTER: str = (
        "blurry, low resolution, jpeg artifacts, distorted logo, text watermark, oversaturated amateur render, "
        "cartoonish, plastic skin, deformed hands, poor composition, cluttered background, chromatic aberration"
    )

    def __init__(self):
        pass

    def build_brand_visual_prompt(
        self,
        brand_name: str,
        style_archetype: str,
        primary_palette: List[str],
        materiality: str = "Matte Ceramic & Frosted Glass",
        scene_type: str = "hero_packaging",
        aspect_ratio: str = "16:9"
    ) -> Dict[str, Any]:
        """
        Synthesizes an end-to-end prompt package with positive, negative, and parameter flags.
        """
        # Determine lighting & lens based on style archetype
        archetype_lower = style_archetype.lower()
        if "minimal" in archetype_lower or "swiss" in archetype_lower:
            lighting = self.LIGHTING_PRESETS["studio_minimal"]
            camera = self.CAMERA_PRESETS["macro_product"]
            aesthetic_tags = "minimalist industrial design, Dieter Rams aesthetic, pristine white space, balanced proportions"
        elif "luxury" in archetype_lower or "editorial" in archetype_lower:
            lighting = self.LIGHTING_PRESETS["luxury_dramatic"]
            camera = self.CAMERA_PRESETS["editorial_portrait"]
            aesthetic_tags = "haute luxury brand identity, bespoke tactile packaging, embossed hot foil stamping, Kinfolk magazine style"
        elif "tech" in archetype_lower or "kinetic" in archetype_lower:
            lighting = self.LIGHTING_PRESETS["cyber_neon"]
            camera = self.CAMERA_PRESETS["spatial_wide"]
            aesthetic_tags = "futuristic generative hardware, sleek aerodynamic curves, dark mode UI visualization, precision engineering"
        else:
            lighting = self.LIGHTING_PRESETS["architectural_ambient"]
            camera = self.CAMERA_PRESETS["macro_product"]
            aesthetic_tags = "contemporary graphic design studio exhibition, clean tactile materials, gallery lighting"

        # Color palette string formatting
        color_clause = ", ".join(primary_palette[:4])
        color_description = f"harmonized color palette featuring dominant tones of {color_clause}"

        # Subject prompt construction
        if scene_type == "hero_packaging":
            subject = f"luxury minimalist product packaging suite for {brand_name}, embossed typography, tactile recycled unbleached paperboard"
        elif scene_type == "brand_spatial":
            subject = f"flagship concept brand boutique interior for {brand_name}, architectural monolith display counter, museum ambiance"
        elif scene_type == "digital_interface":
            subject = f"futuristic spatial interface glass viewport for {brand_name}, glowing data telemetry, clean typographic cards"
        else:
            subject = f"brand identity stationery mockup for {brand_name}, business cards, letterhead, foil emboss"

        positive_prompt = (
            f"{subject}, crafted from {materiality}, {color_description}. "
            f"{aesthetic_tags}. {lighting}. {camera}. Ultra-detailed, 8k, award-winning art direction."
        )

        midjourney_prompt = f"/imagine prompt: {positive_prompt} --ar {aspect_ratio} --stylize 250 --v 6.1"

        return {
            "brand_name": brand_name,
            "style_archetype": style_archetype,
            "scene_type": scene_type,
            "positive_prompt": positive_prompt,
            "negative_prompt": self.NEGATIVE_MASTER,
            "midjourney_command": midjourney_prompt,
            "sdxl_parameters": {
                "steps": 35,
                "cfg_scale": 7.0,
                "sampler": "DPM++ 2M Karras",
                "width": 1344 if aspect_ratio == "16:9" else 1024,
                "height": 768 if aspect_ratio == "16:9" else 1024
            },
            "lighting_setup": lighting,
            "camera_spec": camera
        }

    def generate_wild_billboard_prompt(
        self,
        brand_name: str,
        city: str = "Tokyo Ginza",
        mood: str = "Dusk Rain Atmosphere",
        primary_hex: str = "#191918"
    ) -> str:
        """
        Generates realistic Brand-in-the-Wild billboard placement prompt.
        """
        return (
            f"Massive architectural monolithic outdoor billboard advertisement for brand '{brand_name}' "
            f"installed in prime urban intersection of {city}, {mood}. "
            f"Wet asphalt reflection with vibrant puddles, towering skyscrapers, ambient city glow. "
            f"Minimalist billboard design showcasing single clean serif lettermark on deep background ({primary_hex}). "
            f"Shot on Sony A7R V, 35mm f/1.4 GM, cinematic atmospheric grading, hyper-realistic street photography --ar 16:9 --v 6.1"
        )
