"""
AGIX AI Engine Server.
FastAPI microservice providing endpoints for Visual DNA, K-Means palette extraction, and Coherence Audits.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from .color_quantizer import (
    generate_color_harmonies,
    compute_apca_contrast,
    rgb_to_oklch,
    hex_to_rgb,
)
from .dna_extractor import extract_visual_dna, VisualDNAReport
from .coherence_analyzer import audit_brand_coherence, CoherenceAuditResult

app = FastAPI(
    title="AGIX Creative Intelligence Engine",
    description="Multimodal AI visual analytics, OKLCH color science, and brand coherence services.",
    version="2.0.0",
)

# Enable CORS for Next.js development client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class DNAExtractRequest(BaseModel):
    project_id: str
    brand_name: str
    reference_images: List[str] = []
    saved_colors: Optional[List[str]] = None
    preferred_fonts: Optional[List[str]] = None


class HarmonyRequest(BaseModel):
    base_hex: str
    harmony_type: str = "Complementary"


class CoherenceRequest(BaseModel):
    brand_name: str
    palette_hexes: List[str]
    headline_font: str
    body_font: str
    target_personality: str = "Premium / Sophisticated"


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AGIX Python Intelligence Engine",
        "version": "2.0.0",
        "supported_color_spaces": ["OKLCH", "APCA", "sRGB", "Display-P3"],
    }


@app.post("/api/dna/extract", response_model=VisualDNAReport)
def extract_dna_endpoint(req: DNAExtractRequest):
    try:
        report = extract_visual_dna(
            project_id=req.project_id,
            brand_name=req.brand_name,
            reference_images=req.reference_images,
            saved_colors=req.saved_colors,
            preferred_fonts=req.preferred_fonts,
        )
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/color/harmonies")
def color_harmonies_endpoint(req: HarmonyRequest):
    try:
        swatches = generate_color_harmonies(req.base_hex, req.harmony_type)
        return {"base_hex": req.base_hex, "harmony_type": req.harmony_type, "swatches": swatches}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/coherence/audit", response_model=CoherenceAuditResult)
def coherence_audit_endpoint(req: CoherenceRequest):
    try:
        result = audit_brand_coherence(
            brand_name=req.brand_name,
            palette_hexes=req.palette_hexes,
            headline_font=req.headline_font,
            body_font=req.body_font,
            target_personality=req.target_personality,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
