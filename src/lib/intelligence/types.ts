import type { CanvasItem, BrandBrain, BrandProject } from "@/lib/data";

// ============================================================================
// 1. VISUAL DNA ENGINE TYPES
// ============================================================================

export interface ColorDNAEntry {
  hex: string;
  name: string;
  percentage: number;
  role: "Dominant" | "Secondary" | "Accent" | "Background" | "Neutral";
}

export interface VisualDNAReport {
  id: string;
  projectId: string;
  projectName: string;
  overview: string;
  observedAssetCount: number;
  colorDNA: {
    dominant: ColorDNAEntry[];
    secondary: ColorDNAEntry[];
    paletteMood: string;
    harmonyType: "Monochromatic" | "Analogous" | "Complementary" | "Triadic" | "Split-Complementary" | "Neutral with Vibrant Accent";
    contrastRatio: number; // e.g. 7.5
    isObserved: true; // Explicitly marked as actual image data
  };
  typographyDNA: {
    primaryClassification: "Geometric Sans" | "Humanist Sans" | "High-Contrast Modern Serif" | "Editorial Serif" | "Mono Display" | "Expressive Display";
    characteristics: string[];
    weightRhythm: string;
    contrastLevel: "High" | "Moderate" | "Subtle";
    suggestedPairings: {
      heading: string;
      body: string;
      rationale: string;
    }[];
    isObserved: boolean;
  };
  shapeDNA: {
    shapeLanguage: "Sharp Geometric" | "Soft Organic" | "Architectural Minimalist" | "Angular Dynamic" | "Fluid Sculptural";
    cornerTreatment: string;
    density: "Spacious & Airy" | "Balanced Grid" | "Dense & Textured";
    recurringMotifs: string[];
  };
  compositionDNA: {
    gridSystem: "Swiss Modular" | "Asymmetric Editorial" | "Monumental Centered" | "Organic Scatter" | "Utilitarian Column";
    negativeSpaceRatio: string;
    focalDistribution: string;
    balance: "Dynamic Asymmetry" | "Formal Symmetry" | "Tension Balanced";
  };
  moodDNA: {
    primaryMood: string;
    secondaryMoods: string[];
    temperature: "Cool" | "Warm" | "Neutral Slate" | "Chromatic High-Contrast";
    energyLevel: "Calm & Contemplative" | "Steady & Authoritative" | "High Impact" | "Refined & Subdued";
    aestheticArchetype: string;
  };
  visualHierarchy: {
    dominantElement: string;
    secondaryFlow: string;
    backgroundLayering: string;
  };
  keyCharacteristics: {
    title: string;
    description: string;
    type: "observed" | "interpretation";
  }[];
  reusableTokens: {
    name: string;
    summary: string;
    colors: Record<string, string>;
    fonts: { heading: string; body: string };
  };
  generatedAt: string;
}

// ============================================================================
// 2. ASK YOUR BOARD TYPES
// ============================================================================

export interface BoardAssetReference {
  id: string;
  type: string;
  title: string;
  previewText?: string;
  color?: string;
  imageUrl?: string;
}

export interface BoardChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  referencedAssets?: BoardAssetReference[];
  suggestedFollowUps?: string[];
  intent?: "color_analysis" | "font_match" | "inconsistency_check" | "direction_suggestion" | "reference_rationale" | "comparison" | "general";
}

// ============================================================================
// 3. DIRECTION CLASH TYPES
// ============================================================================

export interface ClashDirectionItem {
  id: string;
  name: string;
  palette: string[];
  fonts: { heading: string; body: string };
  mood: string;
  personality: string;
  composition: string;
  targetAudienceFit: number; // 0 - 100
  positioningFit: number; // 0 - 100
  strengths: string[];
  weaknesses: string[];
}

export interface DirectionClashReport {
  id: string;
  projectId: string;
  directions: ClashDirectionItem[];
  similarities: string[];
  differences: string[];
  inconsistencies: string[];
  recommendation: {
    recommendedDirectionId: string;
    recommendedDirectionName: string;
    rationale: string;
    tacticalSteps: string[];
  };
  comparedAt: string;
}

// ============================================================================
// 4. BRAND COHERENCE ENGINE TYPES
// ============================================================================

export interface CoherenceCriterion {
  name: string;
  score: number; // 0 - 100
  weight: number; // percentage
  explanation: string;
}

export interface CoherenceConflict {
  id: string;
  severity: "high" | "medium" | "low";
  category: "Color" | "Typography" | "Imagery" | "Logo Style" | "Positioning";
  title: string;
  description: string;
  affectedElements: string[];
  suggestion: string;
}

export interface BrandCoherenceReport {
  id: string;
  projectId: string;
  overallScore: number; // 0 - 100
  grade: "A+" | "A" | "B+" | "B" | "C" | "Needs Alignment";
  categoryScores: {
    colorConsistency: number;
    typographyConsistency: number;
    visualConsistency: number;
    personalityAlignment: number;
  };
  criteriaBreakdown: CoherenceCriterion[];
  conflicts: CoherenceConflict[];
  actionableSuggestions: {
    title: string;
    action: string;
    impact: "High Impact" | "Medium Impact" | "Quick Polish";
  }[];
  generatedAt: string;
}

// ============================================================================
// 5. REFERENCE INTELLIGENCE TYPES
// ============================================================================

export interface ReferenceIntelligenceReport {
  referenceId: string;
  referenceTitle: string;
  imageUrl?: string;
  source?: string;
  observedData: {
    dominantColors: { hex: string; name: string; percentage: number }[];
    paletteMood: string;
    visualComposition: string;
    detectedTypefaceStyle?: string;
    aspectRatio: string;
    textureStyle: string;
  };
  aiInterpretations: {
    designStyle: string;
    moodTags: string[];
    visualHierarchy: string;
    distinctiveElements: string[];
    creativeApplications: string[];
    suggestedRole: string;
  };
  analyzedAt: string;
}

// ============================================================================
// 6. CREATIVE EVOLUTION TIMELINE TYPES
// ============================================================================

export type TimelineEventType =
  | "reference_added"
  | "reference_removed"
  | "color_change"
  | "typography_change"
  | "direction_created"
  | "direction_approved"
  | "ai_recommendation"
  | "decision_milestone"
  | "client_feedback";

export interface TimelineMilestone {
  id: string;
  projectId: string;
  timestamp: string;
  type: TimelineEventType;
  title: string;
  description: string;
  author: string;
  changeDetails?: {
    before?: string;
    after?: string;
    diffSummary?: string;
  };
  decisionRationale?: string;
  tags: string[];
  snapshot?: {
    canvasObjectsCount: number;
    palette: string[];
    fontSpecimen: string;
  };
}

// ============================================================================
// 7. BRAND IN THE WILD TYPES
// ============================================================================

export type WildApplicationContext =
  | "website"
  | "mobile"
  | "business_card"
  | "packaging"
  | "social"
  | "poster"
  | "presentation"
  | "stationery";

export interface WildPreviewCustomization {
  headline?: string;
  subheadline?: string;
  callToAction?: string;
  invertedTheme?: boolean;
}

// ============================================================================
// 8. CREATIVE ALTERNATIVES TYPES
// ============================================================================

export type AlternativePreset =
  | "more_minimal"
  | "more_luxurious"
  | "more_experimental"
  | "warmer"
  | "more_futuristic"
  | "more_editorial"
  | "more_professional"
  | "custom";

export interface CreativeAlternativeOption {
  id: string;
  preset: AlternativePreset;
  title: string;
  rationale: string;
  palette: string[];
  typography: { heading: string; body: string };
  visualShift: string;
  personalityShift: string;
  keyChanges: string[];
  status: "pending" | "accepted" | "rejected";
}

export interface CreativeAlternativeBatch {
  id: string;
  projectId: string;
  targetType: "palette" | "typography" | "direction" | "reference" | "concept";
  originalName: string;
  instruction: string;
  alternatives: CreativeAlternativeOption[];
  createdAt: string;
}

// ============================================================================
// 9. CREATIVE BRIEF TO BLUEPRINT TYPES
// ============================================================================

export interface BlueprintSection {
  id: string;
  title: string;
  category:
    | "brand_overview"
    | "business_objectives"
    | "target_audience"
    | "brand_positioning"
    | "brand_personality"
    | "brand_keywords"
    | "competitor_info"
    | "visual_preferences"
    | "color_direction"
    | "typography_direction"
    | "creative_constraints"
    | "deliverables";
  content: string;
  verbatimClientNotes?: string;
  isAiInterpretation: boolean;
}

export interface BrandBlueprint {
  id: string;
  projectId?: string;
  clientName: string;
  brandName: string;
  rawClientInput: string;
  preservedClientNotes: string;
  sections: BlueprintSection[];
  status: "draft" | "reviewed" | "converted_to_project";
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// 10. CLIENT DIRECTION APPROVAL TYPES
// ============================================================================

export interface ClientReviewDirection {
  id: string;
  title: string;
  description: string;
  palette: string[];
  typography: { heading: string; body: string };
  assets: {
    id: string;
    type: string;
    title: string;
    imageUrl?: string;
    previewText?: string;
  }[];
}

export interface ClientInlineComment {
  id: string;
  elementId?: string;
  directionId: string;
  author: string;
  authorType: "client" | "designer";
  content: string;
  timestamp: string;
  resolved: boolean;
}

export interface ClientPortalShare {
  id: string;
  projectId: string;
  token: string;
  brandName: string;
  clientName: string;
  directions: ClientReviewDirection[];
  status: "pending_review" | "in_review" | "revisions_requested" | "approved";
  selectedDirectionId?: string;
  comments: ClientInlineComment[];
  activityLogs: {
    timestamp: string;
    action: string;
    actor: string;
  }[];
  approvalData?: {
    clientName: string;
    clientEmail?: string;
    signature: string;
    approvedDirectionId: string;
    feedback?: string;
    timestamp: string;
  };
  revisionNotes?: string;
  active: boolean;
  createdAt: string;
}
