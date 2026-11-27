"""
Semantic Brand Coherence & Natural Language Tone Engine for AGIX.
Audits brand guidelines, pitch decks, and copy for tone drift, lexical density,
and emotional resonance alignment.
"""

from typing import List, Dict, Tuple, Any, Optional
import math
import re


# Lexical archetype semantic dictionaries
ARCHETYPE_VOCABULARIES: Dict[str, Dict[str, float]] = {
    "Architectural Minimalist": {
        "restraint": 1.0, "monolith": 0.9, "tectonic": 0.85, "limestone": 0.8,
        "silence": 0.95, "unadorned": 0.9, "spatial": 0.85, "proportion": 0.9,
        "honest": 0.75, "concrete": 0.8, "void": 0.85, "tactile": 0.7,
        "austere": 0.8, "patina": 0.75, "immutable": 0.85, "negative space": 0.9
    },
    "Kinetic Cybernetic": {
        "velocity": 0.95, "quantum": 0.9, "autonomous": 0.95, "telemetry": 0.9,
        "interface": 0.85, "bandwidth": 0.8, "synthetic": 0.85, "hyper": 0.9,
        "kinetic": 1.0, "latency": 0.8, "vector": 0.85, "protocol": 0.9,
        "algorithm": 0.9, "luminescence": 0.85, "dynamic": 0.8, "sub-millisecond": 0.95
    },
    "Haute Editorial Luxury": {
        "bespoke": 0.95, "atelier": 0.9, "curation": 0.85, "heritage": 0.9,
        "patrimony": 0.9, "opulent": 0.8, "botanical": 0.75, "couture": 0.95,
        "sensorial": 0.85, "distilled": 0.8, "artisanal": 0.85, "rare": 0.8,
        "elegance": 0.9, "terroir": 0.85, "timeless": 0.9, "exquisite": 0.95
    },
    "Radical Brutalism": {
        "raw": 1.0, "unfiltered": 0.9, "monochrome": 0.85, "confrontational": 0.9,
        "anti-aesthetic": 0.95, "industrial": 0.85, "abrasive": 0.8, "utilitarian": 0.9,
        "exposed": 0.85, "grid": 0.8, "structural": 0.85, "rebar": 0.8,
        "asphalt": 0.8, "subversive": 0.95, "non-conformist": 0.9, "pure": 0.75
    }
}


class BrandToneAuditor:
    """
    Evaluates brand copy against defined target personality vectors using cosine similarity.
    """

    def __init__(self):
        self.vocabularies = ARCHETYPE_VOCABULARIES

    def tokenize_and_clean(self, text: str) -> List[str]:
        cleaned = re.sub(r"[^\w\s-]", " ", text.lower())
        tokens = [t.strip() for t in cleaned.split() if len(t.strip()) > 2]
        return tokens

    def compute_lexical_density(self, text: str) -> Dict[str, Any]:
        """
        Calculates ratio of content words (nouns, verbs, adjectives) to grammatical structure.
        High lexical density indicates authoritative, concise brand voice.
        """
        tokens = self.tokenize_and_clean(text)
        if not tokens:
            return {"density": 0.0, "unique_words": 0, "total_words": 0}

        unique_tokens = set(tokens)
        density = len(unique_tokens) / len(tokens)

        # Average word length
        avg_len = sum(len(w) for w in tokens) / len(tokens)

        return {
            "lexical_density_ratio": round(density, 3),
            "total_tokens": len(tokens),
            "unique_vocabulary": len(unique_tokens),
            "average_word_length": round(avg_len, 2),
            "reading_tempo": "Deliberate / Slow" if avg_len > 6.2 else "Dynamic / Fast"
        }

    def score_archetype_alignment(
        self,
        copy_text: str,
        target_archetype: str
    ) -> Dict[str, Any]:
        """
        Computes semantic vector projection against style archetype dictionary.
        """
        tokens = self.tokenize_and_clean(copy_text)
        token_set = set(tokens)

        target_dict = self.vocabularies.get(target_archetype, self.vocabularies["Architectural Minimalist"])
        matched_keywords = []
        accum_score = 0.0

        for word, weight in target_dict.items():
            if word in token_set:
                matched_keywords.append({"word": word, "weight": weight})
                accum_score += weight

        # Baseline confidence score bounded 0 to 100
        max_possible = sum(target_dict.values())
        raw_pct = (accum_score / max(1.0, max_possible * 0.35)) * 100.0
        final_score = min(98.5, max(42.0, raw_pct))

        # Check alternative archetypes to test for brand drift
        alternative_scores = {}
        for arch_name, vocab in self.vocabularies.items():
            score = sum(weight for w, weight in vocab.items() if w in token_set)
            alternative_scores[arch_name] = round((score / (sum(vocab.values()) * 0.35)) * 100.0, 1)

        drift_detected = False
        drift_direction = None
        for arch_name, alt_score in alternative_scores.items():
            if arch_name != target_archetype and alt_score > final_score + 10.0:
                drift_detected = True
                drift_direction = arch_name
                break

        return {
            "target_archetype": target_archetype,
            "alignment_score": round(final_score, 1),
            "grade": "Exceptional Coherence" if final_score >= 85 else "Acceptable Alignment" if final_score >= 70 else "Tonal Drift Warning",
            "matched_keywords": matched_keywords,
            "brand_drift_detected": drift_detected,
            "drift_suggestion": f"Copy is drifting toward '{drift_direction}'. Reinforce {target_archetype} vocabulary." if drift_detected else "Tonal focus is firmly anchored.",
            "archetype_distribution": alternative_scores
        }
