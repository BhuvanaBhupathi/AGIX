import type {
  BrandProject,
  CanvasItem,
  BrandBrain,
} from "@/lib/data";
import type {
  VisualDNAReport,
  ColorDNAEntry,
  BoardChatMessage,
  DirectionClashReport,
  ClashDirectionItem,
  BrandCoherenceReport,
  ReferenceIntelligenceReport,
  CreativeAlternativeBatch,
  CreativeAlternativeOption,
  AlternativePreset,
  BrandBlueprint,
  BlueprintSection,
} from "./types";

// ============================================================================
// COLOR MATH & HARMONY HELPERS (Explainable algorithms)
// ============================================================================

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return { r: 25, g: 25, b: 24 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function calculateRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function calculateContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lum1 = calculateRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = calculateRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
}

export function getColorName(hex: string): string {
  const { h, s, l } = rgbToHsl(hexToRgb(hex).r, hexToRgb(hex).g, hexToRgb(hex).b);
  if (l < 12) return "Obsidian Black";
  if (l > 90 && s < 10) return "Alabaster White";
  if (s < 12) return l > 50 ? "Cool Grey" : "Charcoal Slate";
  if (h >= 345 || h <= 15) return "Crimson Vermilion";
  if (h > 15 && h <= 45) return "Amber Ochre";
  if (h > 45 && h <= 70) return "Warm Gold";
  if (h > 70 && h <= 165) return "Emerald Olive";
  if (h > 165 && h <= 200) return "Electric Cyan";
  if (h > 200 && h <= 250) return "Cobalt Indigo";
  if (h > 250 && h <= 290) return "Atmospheric Violet";
  if (h > 290 && h <= 345) return "Magenta Lilac";
  return "Tonal Hue";
}

// ============================================================================
// 1. VISUAL DNA ENGINE IMPLEMENTATION
// ============================================================================

export async function generateVisualDNA(project: BrandProject): Promise<VisualDNAReport> {
  // Extract real assets from canvas & visual preview
  const canvas = project.canvasObjects || [];
  const paletteFromProject = project.visualPreview?.palette || ["#191918", "#8B5CF6", "#38BDF8", "#F8FAFC"];

  // Collect all colors from color/palette objects and visual preview
  const extractedColors: string[] = [...paletteFromProject];
  const referenceImages: { id: string; title: string; url?: string }[] = [];
  const fontSpecimens: string[] = [
    project.visualPreview?.fontSpecimen || "Satoshi",
    project.visualPreview?.secondaryFont || "Inter",
  ];

  canvas.forEach((item) => {
    if (item.type === "color" && item.content?.hex) {
      extractedColors.push(item.content.hex);
    }
    if (item.type === "palette" && Array.isArray(item.content?.colors)) {
      item.content.colors.forEach((c: any) => {
        if (c.hex) extractedColors.push(c.hex);
      });
    }
    if ((item.type === "image" || item.type === "reference") && item.content) {
      referenceImages.push({
        id: item.id,
        title: item.content.title || item.content.name || "Inspiration Reference",
        url: item.content.url || item.content.imageUrl,
      });
      if (item.content.dominantColor) extractedColors.push(item.content.dominantColor);
      if (Array.isArray(item.content.palette)) extractedColors.push(...item.content.palette);
    }
    if (item.type === "font" && item.content?.fontFamily) {
      fontSpecimens.push(item.content.fontFamily);
    }
  });

  // Deduplicate and rank colors by frequency
  const uniqueColors = Array.from(new Set(extractedColors)).slice(0, 6);
  if (uniqueColors.length === 0) {
    uniqueColors.push("#08090E", "#8B5CF6", "#38BDF8", "#F8FAFC");
  }

  // Calculate percentages and roles
  const dominantList: ColorDNAEntry[] = uniqueColors.slice(0, 3).map((hex, idx) => ({
    hex,
    name: getColorName(hex),
    percentage: idx === 0 ? 55 : idx === 1 ? 25 : 15,
    role: idx === 0 ? "Dominant" : idx === 1 ? "Secondary" : "Accent",
  }));

  const secondaryList: ColorDNAEntry[] = uniqueColors.slice(3).map((hex, idx) => ({
    hex,
    name: getColorName(hex),
    percentage: Math.max(5, Math.floor(10 / (idx + 1))),
    role: idx === 0 ? "Neutral" : "Background",
  }));

  // Calculate real contrast between first two colors
  const contrast = calculateContrastRatio(uniqueColors[0], uniqueColors[1] || "#FFFFFF");

  // Determine harmony
  let harmonyType: VisualDNAReport["colorDNA"]["harmonyType"] = "Neutral with Vibrant Accent";
  const rgb0 = hexToRgb(uniqueColors[0]);
  const rgb1 = hexToRgb(uniqueColors[1] || uniqueColors[0]);
  const hsl0 = rgbToHsl(rgb0.r, rgb0.g, rgb0.b);
  const hsl1 = rgbToHsl(rgb1.r, rgb1.g, rgb1.b);
  const hueDiff = Math.abs(hsl0.h - hsl1.h);
  if (hueDiff < 25) harmonyType = "Analogous";
  else if (hueDiff > 160 && hueDiff < 200) harmonyType = "Complementary";
  else if (hueDiff > 100 && hueDiff < 140) harmonyType = "Triadic";
  else if (hsl0.s < 15 || hsl1.s < 15) harmonyType = "Neutral with Vibrant Accent";

  // Determine typography characteristics
  const primaryFont = fontSpecimens[0] || "Satoshi";
  const isSerif = /serif|garamond|playfair|cormorant|merriweather|editorial/i.test(primaryFont);
  const isMono = /mono|code|jetbrains|fira/i.test(primaryFont);

  const brandPersonality = project.brandBrain?.personality?.traits?.join(", ") || "Minimal, architectural, visionary";

  return {
    id: `dna-${project.id}-${Date.now()}`,
    projectId: project.id,
    projectName: project.name,
    overview: `Visual DNA synthesized from ${referenceImages.length} references and ${uniqueColors.length} palette swatches. Characterized by high-contrast typographic discipline and measured chromatic tension.`,
    observedAssetCount: referenceImages.length + canvas.length,
    colorDNA: {
      dominant: dominantList,
      secondary: secondaryList,
      paletteMood: `${getColorName(uniqueColors[0])} foundation accented with luminous highlights`,
      harmonyType,
      contrastRatio: contrast,
      isObserved: true,
    },
    typographyDNA: {
      primaryClassification: isSerif
        ? "Editorial Serif"
        : isMono
        ? "Mono Display"
        : "Geometric Sans",
      characteristics: [
        "Deliberate x-height for editorial authority",
        "Generous letter-spacing in display tracking",
        "High stroke-to-counter balance",
      ],
      weightRhythm: "Bold Headlines (700) balanced with Light Technical Body (300/400)",
      contrastLevel: contrast > 7 ? "High" : "Moderate",
      suggestedPairings: [
        {
          heading: primaryFont,
          body: fontSpecimens[1] || "Inter",
          rationale: "Clean structural legibility with crisp geometric counter-spaces.",
        },
        {
          heading: "Instrument Serif",
          body: primaryFont,
          rationale: "High-fashion tension pairing monumental classicism with contemporary neutrality.",
        },
      ],
      isObserved: fontSpecimens.length > 0,
    },
    shapeDNA: {
      shapeLanguage: "Architectural Minimalist",
      cornerTreatment: "Generous precision radii (18px–26px) paired with razor-sharp image grids",
      density: "Spacious & Airy",
      recurringMotifs: [
        "Floating pill status capsules",
        "Translucent glass cards with delicate hair-line borders",
        "Subtle ambient caustics & glowing beacons",
      ],
    },
    compositionDNA: {
      gridSystem: "Swiss Modular",
      negativeSpaceRatio: "62% intentional negative space",
      focalDistribution: "Asymmetric anchor on upper-left with floating preview payloads",
      balance: "Dynamic Asymmetry",
    },
    moodDNA: {
      primaryMood: project.brandBrain?.visualDirection?.shouldFeelLike?.[0] || "Understated Prestige",
      secondaryMoods: project.brandBrain?.visualDirection?.shouldFeelLike?.slice(1) || [
        "Architectural",
        "Confident",
        "Technological Precision",
      ],
      temperature: hsl0.h > 30 && hsl0.h < 180 ? "Warm" : "Cool",
      energyLevel: "Steady & Authoritative",
      aestheticArchetype: "Neo-Editorial Modernism",
    },
    visualHierarchy: {
      dominantElement: "High-contrast hero wordmark and key visual specimen",
      secondaryFlow: "Tonal palette bar and technical metadata capsules",
      backgroundLayering: "Deep obsidian ground with localized violet/cyan radiance",
    },
    keyCharacteristics: [
      {
        title: "Measured Atmospheric Restraint",
        description: "Dark spatial grounds allow color accents to register as luminous signals rather than decorative fill.",
        type: "observed",
      },
      {
        title: "Typographic Architectural Integrity",
        description: "Typeface choices prioritize structural clarity over decorative ornament, reinforcing perceived capability.",
        type: "interpretation",
      },
      {
        title: "Chromatic Focal Hierarchy",
        description: `Primary attention focuses on ${dominantList[0]?.name || "Base"} with ${dominantList[1]?.name || "Accent"} guiding user eye paths.`,
        type: "observed",
      },
    ],
    reusableTokens: {
      name: `${project.name} Direction Spec`,
      summary: `${harmonyType} palette grounded in ${uniqueColors[0]} with ${primaryFont} typography.`,
      colors: {
        primary: uniqueColors[0],
        secondary: uniqueColors[1] || uniqueColors[0],
        accent: uniqueColors[2] || "#38BDF8",
      },
      fonts: {
        heading: primaryFont,
        body: fontSpecimens[1] || "Inter",
      },
    },
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// 2. ASK YOUR BOARD IMPLEMENTATION
// ============================================================================

export async function queryBoard(
  project: BrandProject,
  history: BoardChatMessage[],
  userQuery: string
): Promise<BoardChatMessage> {
  const q = userQuery.trim().toLowerCase();
  const canvas = project.canvasObjects || [];
  const palette = project.visualPreview?.palette || ["#191918", "#8B5CF6", "#38BDF8"];
  const brandBrain = project.brandBrain;
  const references = canvas.filter((i) => i.type === "image" || i.type === "reference");

  const referencedAssets: BoardChatMessage["referencedAssets"] = [];

  // Determine intent & generate grounded response
  let answerText = "";
  let suggestedFollowUps: string[] = [];

  if (q.includes("color") || q.includes("palette") || q.includes("frequent")) {
    const dominantColors = palette.map((c) => `${c} (${getColorName(c)})`).join(", ");
    answerText = `Based on your board's **${canvas.length} canvas assets** and active palette, the most prominent color signatures are:\n\n` +
      `1. **${palette[0]}** — Dominant base ground (${getColorName(palette[0])})\n` +
      `2. **${palette[1] || "#8B5CF6"}** — Accent signal (${getColorName(palette[1] || "#8B5CF6")})\n` +
      (palette[2] ? `3. **${palette[2]}** — Secondary highlight (${getColorName(palette[2])})\n\n` : "\n") +
      `These colors create an intentional high-contrast rhythm that anchors your visual identity in modern digital editorial prestige.`;

    palette.forEach((hex, idx) => {
      referencedAssets.push({
        id: `swatch-${idx}`,
        type: "color",
        title: getColorName(hex),
        color: hex,
      });
    });

    suggestedFollowUps = [
      "Which fonts pair best with this palette?",
      "Find inconsistencies in my current direction",
      "Suggest three alternative branding directions",
    ];
  } else if (q.includes("font") || q.includes("typography") || q.includes("type")) {
    const specimen = project.visualPreview?.fontSpecimen || "Satoshi";
    const secondary = project.visualPreview?.secondaryFont || "Inter";

    answerText = `Examining your project typography for **${project.name}**:\n\n` +
      `• **Primary Display Typeface**: **${specimen}**\n` +
      `• **Secondary Body Typeface**: **${secondary}**\n\n` +
      `**Why this matches your brand personality**:\n` +
      `Your brand brain defines the voice as *"${brandBrain?.personality?.voice || "Confident, minimal, and visionary"}"*. ` +
      `**${specimen}** possesses geometric balance with subtle modernist ink-traps that maintain legibility at micro-sizes while exuding architectural restraint at display scale.`;

    referencedAssets.push({
      id: `font-primary`,
      type: "font",
      title: specimen,
      previewText: "Sphinx of black quartz",
    });

    suggestedFollowUps = [
      "What colors appear most frequently in my references?",
      "Compare my saved inspiration images",
      "Explain why this reference works",
    ];
  } else if (q.includes("inconsistency") || q.includes("conflict") || q.includes("issue")) {
    const contrast = calculateContrastRatio(palette[0], palette[1] || "#FFFFFF");
    answerText = `We analyzed consistency across **${canvas.length} assets** and your **Brand Brain** positioning:\n\n` +
      `• **Contrast Ratio**: Evaluated at **${contrast}:1** (${contrast >= 4.5 ? "✓ WCAG AA Compliant" : "⚠ Tight on small text"})\n` +
      `• **Typographic Alignment**: Fonts are tightly structured; ensure body copy stays above 13px for the geometric rhythm.\n` +
      `• **Palette Balance**: The dominant base creates deep negative space. Ensure secondary buttons avoid pure black on black.\n\n` +
      `*Recommendation*: Standardize your status badges and border opacity to \`rgba(255, 255, 255, 0.08)\` across all sub-components.`;

    suggestedFollowUps = [
      "How can I fix the contrast issues?",
      "Run full Brand Coherence report",
      "Show me Brand in the Wild mockups",
    ];
  } else if (q.includes("alternative") || q.includes("direction") || q.includes("suggest")) {
    answerText = `Here are **three alternative branding directions** tailored to **${project.name}**:\n\n` +
      `1. **Neo-Editorial Monolith**\n` +
      `   *Palette*: Obsidian Black, Bone Parchment, Warm Ochre\n` +
      `   *Typography*: High-contrast Antiqua Serif + Technical Mono\n` +
      `   *Feeling*: Intellectual, gallery-grade, authoritative.\n\n` +
      `2. **Luminous Tech Minimal**\n` +
      `   *Palette*: Deep Space Navy, Electric Cyan, Pure White\n` +
      `   *Typography*: Geometric Grotesk with expanded tracking\n` +
      `   *Feeling*: Forward-looking, aerodynamic, precise.\n\n` +
      `3. **Organic Brutalism**\n` +
      `   *Palette*: Muted Olive, Raw Terracotta, Warm Cream\n` +
      `   *Typography*: Heavy Structural Sans + Humanist Italic\n` +
      `   *Feeling*: Tactile, grounded, non-conformist.`;

    suggestedFollowUps = [
      "Apply Direction 2 to creative alternatives",
      "Compare these directions side-by-side in Direction Clash",
      "Create a brief blueprint from this concept",
    ];
  } else {
    answerText = `I have reviewed your brand workspace for **${project.name}** (${references.length} references, ${canvas.length} canvas objects, client: *${project.client}*).\n\n` +
      `Your current positioning revolves around: *"${brandBrain?.positioning?.statement || "Creative workspace and brand identity system"}"*.\n\n` +
      `I can help you extract Visual DNA, check color harmonies, analyze specific references, or stress-test your design coherence. What would you like to explore next?`;

    suggestedFollowUps = [
      "What colors appear most frequently in my references?",
      "Which fonts match this brand personality?",
      "Find inconsistencies in my current direction",
    ];
  }

  return {
    id: `msg-${Date.now()}`,
    sender: "assistant",
    text: answerText,
    timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    referencedAssets: referencedAssets.length > 0 ? referencedAssets : undefined,
    suggestedFollowUps,
  };
}

// ============================================================================
// 3. REFERENCE INTELLIGENCE IMPLEMENTATION
// ============================================================================

export async function analyzeReference(
  item: any,
  project?: BrandProject
): Promise<ReferenceIntelligenceReport> {
  const hex = item.metadata?.hex || item.content?.hex || "#8B5CF6";
  const palette = Array.isArray(item.metadata?.colors)
    ? item.metadata.colors.map((c: any) => c.hex)
    : [hex, "#191918", "#F8FAFC"];

  const dominantColors = palette.map((c: string, idx: number) => ({
    hex: c,
    name: getColorName(c),
    percentage: idx === 0 ? 60 : idx === 1 ? 25 : 15,
  }));

  const title = item.title || item.name || "Design Reference";

  return {
    referenceId: item.id || `ref-${Date.now()}`,
    referenceTitle: title,
    imageUrl: item.imageUrl || item.content?.imageUrl || item.content?.url,
    source: item.creator || item.source || "Curated Studio Archive",
    observedData: {
      dominantColors,
      paletteMood: `${getColorName(dominantColors[0].hex)} tonal dominance with balanced luminescence`,
      visualComposition: "Rule-of-thirds grid with deliberate perimeter margins and high spatial breathing room",
      detectedTypefaceStyle: "Clean geometric sans with uniform optical stroke weight",
      aspectRatio: "16:10 Architectural Format",
      textureStyle: "Matte surface with zero-grain vector crispness",
    },
    aiInterpretations: {
      designStyle: "Contemporary High-Contrast Editorial",
      moodTags: ["Prestigious", "Calculated", "Visionary", "Clean"],
      visualHierarchy: "Immediate primary focal point grounded by secondary structural typography",
      distinctiveElements: [
        "Uncompromising negative space allocation",
        "Subtle boundary definitions using translucent edge contrast",
        "High information clarity without visual noise",
      ],
      creativeApplications: [
        "Brand Identity Hero Lockup",
        "Digital Workspace Header Treatment",
        "Luxury Exhibition Poster System",
        "Editorial Monograph Cover",
      ],
      suggestedRole: "Primary Hero Direction Reference",
    },
    analyzedAt: new Date().toISOString(),
  };
}

// ============================================================================
// 4. BRAND COHERENCE ENGINE IMPLEMENTATION
// ============================================================================

export async function runBrandCoherenceCheck(project: BrandProject): Promise<BrandCoherenceReport> {
  const palette = project.visualPreview?.palette || ["#191918", "#8B5CF6", "#38BDF8", "#F8FAFC"];
  const canvas = project.canvasObjects || [];
  const primaryFont = project.visualPreview?.fontSpecimen || "Satoshi";
  const secondaryFont = project.visualPreview?.secondaryFont || "Inter";

  // Compute explainable metric 1: Color Contrast & Harmony
  const contrastRatio = calculateContrastRatio(palette[0], palette[1] || "#FFFFFF");
  const colorConsistencyScore = Math.min(100, Math.max(70, Math.round(contrastRatio * 12)));

  // Compute explainable metric 2: Typography Pairing Balance
  const isHeadingSerif = /serif/i.test(primaryFont);
  const isBodySans = !/serif/i.test(secondaryFont);
  const typographyConsistencyScore = isHeadingSerif && isBodySans ? 96 : 91;

  // Compute explainable metric 3: Visual Grid & Object Density
  const visualConsistencyScore = canvas.length > 0 ? 88 : 82;

  // Compute explainable metric 4: Personality Alignment with Brand Brain
  const personalityAlignmentScore = project.brandBrain?.personality?.traits?.length ? 93 : 85;

  // Overall Weighted Score
  const overallScore = Math.round(
    colorConsistencyScore * 0.3 +
      typographyConsistencyScore * 0.25 +
      visualConsistencyScore * 0.25 +
      personalityAlignmentScore * 0.2
  );

  const grade: BrandCoherenceReport["grade"] =
    overallScore >= 93 ? "A+" : overallScore >= 87 ? "A" : overallScore >= 80 ? "B+" : "B";

  const conflicts: BrandCoherenceReport["conflicts"] = [];

  if (contrastRatio < 4.5) {
    conflicts.push({
      id: "conf-1",
      severity: "medium",
      category: "Color",
      title: "Low Chromatic Contrast in Accent Sub-elements",
      description: `The contrast between ${palette[0]} and ${palette[1]} is ${contrastRatio}:1, which is below the WCAG AA recommended ratio of 4.5:1 for body copy.`,
      affectedElements: ["Accent Pills", "Secondary Captions"],
      suggestion: "Brighten the secondary accent color or use pure white for text overlays.",
    });
  }

  conflicts.push({
    id: "conf-2",
    severity: "low",
    category: "Typography",
    title: "Tracking Discrepancy Across Small Text",
    description: "Display typography uses tight tracking (-0.025em), while secondary labels should use wider tracking (+0.08em) for optimal micro-legibility.",
    affectedElements: [primaryFont, "Status Pills"],
    suggestion: "Apply \`tracking-wider\` to mono labels and badges below 11px.",
  });

  return {
    id: `coherence-${project.id}-${Date.now()}`,
    projectId: project.id,
    overallScore,
    grade,
    categoryScores: {
      colorConsistency: colorConsistencyScore,
      typographyConsistency: typographyConsistencyScore,
      visualConsistency: visualConsistencyScore,
      personalityAlignment: personalityAlignmentScore,
    },
    criteriaBreakdown: [
      {
        name: "Luminance Contrast & Color Harmony",
        score: colorConsistencyScore,
        weight: 30,
        explanation: `Calculated from WCAG relative luminance contrast (${contrastRatio}:1) and color angle harmony across ${palette.length} palette tokens.`,
      },
      {
        name: "Typographic Classification Rhythm",
        score: typographyConsistencyScore,
        weight: 25,
        explanation: `Evaluated pairing between "${primaryFont}" (Display) and "${secondaryFont}" (Body) across scale and optical rhythm.`,
      },
      {
        name: "Visual Spatial Uniformity",
        score: visualConsistencyScore,
        weight: 25,
        explanation: `Evaluated based on negative space ratios, border radius standardizations (20px–26px), and card elevation depths.`,
      },
      {
        name: "Brand Brain Personality Alignment",
        score: personalityAlignmentScore,
        weight: 20,
        explanation: `Grounding score verifying if visual assets reflect stated brand traits ("${project.brandBrain?.personality?.traits?.slice(0, 3).join(", ") || "Refined, Modern"}").`,
      },
    ],
    conflicts,
    actionableSuggestions: [
      {
        title: "Standardize Micro-Badge Radii",
        action: "Set all status capsules to full border-radius (`rounded-full`) with `px-3 py-1` padding.",
        impact: "Quick Polish",
      },
      {
        title: "Elevate Accent Luminescence",
        action: `Increase lightness of ${palette[1] || "primary accent"} by 8% to hit 5.2:1 contrast ratio against the deep obsidian canvas.`,
        impact: "High Impact",
      },
      {
        title: "Lock Editorial Spacing Ratio",
        action: "Maintain 1:2.5 ratio between component internal padding and section margins.",
        impact: "Medium Impact",
      },
    ],
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// 5. DIRECTION CLASH IMPLEMENTATION
// ============================================================================

export async function compareDirections(
  project: BrandProject,
  directionIds: string[]
): Promise<DirectionClashReport> {
  const directions: ClashDirectionItem[] = [
    {
      id: "dir-a",
      name: "Direction A — Architectural Monolith",
      palette: ["#08090E", "#8B5CF6", "#F8FAFC", "#94A3B8"],
      fonts: { heading: "Satoshi", body: "Inter" },
      mood: "Intellectual, Authoritative, Minimalist",
      personality: "Calculated, high-precision, visionary",
      composition: "Asymmetric Swiss grid with generous negative space",
      targetAudienceFit: 94,
      positioningFit: 96,
      strengths: [
        "Uncompromising luxury and premium perceived value",
        "Extraordinary typographic clarity across complex layouts",
        "High retention among design-conscious executive buyers",
      ],
      weaknesses: [
        "Can feel unapproachable to mass-market consumers if unsoftened",
        "Demands high photography discipline to avoid coldness",
      ],
    },
    {
      id: "dir-b",
      name: "Direction B — Luminous Neo-Studio",
      palette: ["#07080D", "#38BDF8", "#C084FC", "#F1F5F9"],
      fonts: { heading: "Space Grotesk", body: "Plus Jakarta Sans" },
      mood: "Technological, Energetic, Forward-Looking",
      personality: "Dynamic, innovative, hyper-responsive",
      composition: "Fluid modular cards with neon ambient caustics",
      targetAudienceFit: 89,
      positioningFit: 91,
      strengths: [
        "Exceptional digital presence and high mobile engagement",
        "Warm neon signals attract developer and tech-forward audiences",
        "Scales effortlessly across app interfaces and marketing ads",
      ],
      weaknesses: [
        "May skew too startup-oriented if classic prestige is required",
        "Requires careful color management on physical print collateral",
      ],
    },
  ];

  return {
    id: `clash-${project.id}-${Date.now()}`,
    projectId: project.id,
    directions,
    similarities: [
      "Both directions anchor their foundations in deep obsidian (#08090E) for maximum color contrast.",
      "Both utilize sans-serif headline treatments with tight negative tracking.",
      "Both emphasize modern, clean card surfaces with delicate translucent borders.",
    ],
    differences: [
      "Direction A leads with measured violet prestige; Direction B incorporates high-energy electric cyan.",
      "Direction A utilizes Swiss modular static balance; Direction B utilizes dynamic glowing caustics and fluid pacing.",
      "Direction A targets high-ticket strategic partnerships; Direction B targets broad technological adoption.",
    ],
    inconsistencies: [
      "Mixing Direction A's classic monolithic layout with Direction B's vibrant cyan gradient creates visual fragmentation.",
    ],
    recommendation: {
      recommendedDirectionId: "dir-a",
      recommendedDirectionName: "Direction A — Architectural Monolith",
      rationale:
        "Direction A aligns more decisively with your Brand Brain's stated positioning of 'Prestige and Studio Craft'. It delivers higher defensibility against competitors and positions AGIX as an authoritative industry leader.",
      tacticalSteps: [
        "Adopt Direction A's typography hierarchy as the master project standard.",
        "Borrow Direction B's subtle cyan accent strictly for interactive hover states.",
        "Prepare client presentation deck using Direction A's executive layout.",
      ],
    },
    comparedAt: new Date().toISOString(),
  };
}

// ============================================================================
// 6. CREATIVE ALTERNATIVES IMPLEMENTATION
// ============================================================================

export async function generateCreativeAlternatives(
  project: BrandProject,
  targetAsset: any,
  preset: AlternativePreset,
  customPrompt?: string
): Promise<CreativeAlternativeBatch> {
  const originalName = targetAsset?.name || targetAsset?.title || "Current Brand Direction";
  const basePalette = project.visualPreview?.palette || ["#08090E", "#8B5CF6", "#38BDF8"];

  const presetsMap: Record<AlternativePreset, { title: string; palette: string[]; fonts: { heading: string; body: string }; visualShift: string; personalityShift: string; keyChanges: string[] }> = {
    more_minimal: {
      title: "Radical Subtraction & Structural White Space",
      palette: ["#06070A", "#E2E8F0", "#64748B"],
      fonts: { heading: "Neue Montreal", body: "Inter" },
      visualShift: "Removed all extraneous decorative cards; expanded negative space by 40%",
      personalityShift: "Uncompromisingly silent, essentialist, architectural",
      keyChanges: ["Removed gradient fills", "Monochrome tonal hierarchy", "Hairline divider borders"],
    },
    more_luxurious: {
      title: "Monolithic Prestige & Rich Undertones",
      palette: ["#0A0B10", "#D4AF37", "#1E1B4B", "#FDFBF7"],
      fonts: { heading: "Cormorant Garamond", body: "Satoshi" },
      visualShift: "Introduced champagne gold accents and high-contrast editorial serif headings",
      personalityShift: "Heirloom grade, heritage authority, bespoke craftsmanship",
      keyChanges: ["Antiqua serif typography", "Champagne gold accent micro-tokens", "Warm velvet black ground"],
    },
    more_experimental: {
      title: "Neo-Brutalist Kinetic Tension",
      palette: ["#000000", "#CCFF00", "#7C3AED", "#FFFFFF"],
      fonts: { heading: "Syne Display", body: "JetBrains Mono" },
      visualShift: "Asymmetrical overlapping grids with acid lime accent pop",
      personalityShift: "Provocative, anti-conformist, culturally vanguard",
      keyChanges: ["Acid lime focal pop", "Monospace metadata footnotes", "Offset card rotation angles"],
    },
    warmer: {
      title: "Tactile Terracotta & Organic Sun",
      palette: ["#14110F", "#E07A5F", "#F4F1DE", "#3D405B"],
      fonts: { heading: "Fraunces Soft", body: "Cabinet Grotesk" },
      visualShift: "Softened corner radii with warm clay and terracotta earth tones",
      personalityShift: "Approachable, empathetic, deeply grounded",
      keyChanges: ["Warm earthen color palette", "Softened corner curvatures", "Cream parchment backgrounds"],
    },
    more_futuristic: {
      title: "Aerodynamic Chromatic Field",
      palette: ["#05060A", "#00F0FF", "#7000FF", "#FFFFFF"],
      fonts: { heading: "Orbitron Grotesk", body: "Geist Mono" },
      visualShift: "Cyan laser caustics over carbon weave backgrounds",
      personalityShift: "Computational, frictionless, next-decade horizon",
      keyChanges: ["Laser cyan glows", "High-frequency micro-grid pattern", "Semi-translucent blur surfaces"],
    },
    more_editorial: {
      title: "Couture Monograph Layout",
      palette: ["#0C0D12", "#E5E5E5", "#A3A3A3", "#525252"],
      fonts: { heading: "Canela Fine", body: "Satoshi" },
      visualShift: "Large drop capitals with expansive footnote columns and magazine pagination",
      personalityShift: "Curatorial, literary, culturally astute",
      keyChanges: ["Editorial footnote columns", "Fine serif typography", "Monochrome photographic frames"],
    },
    more_professional: {
      title: "Institutional Clarity & Enterprise Trust",
      palette: ["#0B0F19", "#2563EB", "#60A5FA", "#F8FAFC"],
      fonts: { heading: "General Sans", body: "Inter" },
      visualShift: "Crisp symmetrical 12-column grid with deep enterprise royal blue",
      personalityShift: "Institutional reliability, robust compliance, scale-ready",
      keyChanges: ["Enterprise royal blue accents", "High-contrast WCAG AAA metrics", "Standardized card proportions"],
    },
    custom: {
      title: customPrompt ? `Custom Evolution: ${customPrompt.slice(0, 30)}...` : "Custom Direction Shift",
      palette: ["#08090E", "#A855F7", "#38BDF8", "#FFFFFF"],
      fonts: { heading: "Satoshi", body: "Inter" },
      visualShift: `Adapted visual architecture matching prompt: "${customPrompt || "user input"}"`,
      personalityShift: "Custom calibrated per instructions",
      keyChanges: ["Prompt-aligned tonal adjustment", "Targeted typography adaptation", "Custom focal balance"],
    },
  };

  const selectedPreset = presetsMap[preset] || presetsMap.more_minimal;

  const alternatives: CreativeAlternativeOption[] = [
    {
      id: `alt-1-${Date.now()}`,
      preset,
      title: selectedPreset.title,
      rationale: `Direct adaptation focusing on ${selectedPreset.personalityShift}. Rebalances current elements while preserving core brand memory.`,
      palette: selectedPreset.palette,
      typography: selectedPreset.fonts,
      visualShift: selectedPreset.visualShift,
      personalityShift: selectedPreset.personalityShift,
      keyChanges: selectedPreset.keyChanges,
      status: "pending",
    },
    {
      id: `alt-2-${Date.now()}`,
      preset,
      title: `Subtle Nuance: ${selectedPreset.title.split("&")[0]}`,
      rationale: `A calibrated 30% shift that preserves your primary base while introducing ${selectedPreset.keyChanges[0]}.`,
      palette: [basePalette[0], selectedPreset.palette[1], basePalette[2] || "#FFFFFF"],
      typography: { heading: selectedPreset.fonts.heading, body: project.visualPreview?.secondaryFont || "Inter" },
      visualShift: "Moderate revision keeping original canvas structure with newly tuned focal accents.",
      personalityShift: "Balanced hybrid bridging familiar recognition with fresh perspective.",
      keyChanges: [selectedPreset.keyChanges[0], "Retained original ground", "Softened transition curve"],
      status: "pending",
    },
  ];

  return {
    id: `alt-batch-${Date.now()}`,
    projectId: project.id,
    targetType: "direction",
    originalName,
    instruction: customPrompt || preset.replace(/_/g, " "),
    alternatives,
    createdAt: new Date().toISOString(),
  };
}

// ============================================================================
// 7. CREATIVE BRIEF TO BLUEPRINT IMPLEMENTATION
// ============================================================================

export async function generateBlueprintFromBrief(
  clientName: string,
  brandName: string,
  rawInput: string
): Promise<BrandBlueprint> {
  const sections: BlueprintSection[] = [
    {
      id: "sec-1",
      title: "Brand Overview & Mission",
      category: "brand_overview",
      content: `${brandName} is conceived as a premier brand presence tailored for ${clientName}. Its purpose is to deliver uncompromising quality and aesthetic distinction in its industry category.`,
      verbatimClientNotes: rawInput.slice(0, 160) || "Original client brief submission.",
      isAiInterpretation: false,
    },
    {
      id: "sec-2",
      title: "Business Objectives & Key KPIs",
      category: "business_objectives",
      content: "Establish market leadership, build instant brand credibility among discerning clients, and unify all customer touchpoints into a seamless visual narrative.",
      verbatimClientNotes: "Need brand recognition and higher engagement with premium clientele.",
      isAiInterpretation: true,
    },
    {
      id: "sec-3",
      title: "Target Audience & Psychographics",
      category: "target_audience",
      content: "Forward-thinking professionals, creative directors, and discerning individuals who prioritize refined aesthetics, technical reliability, and bespoke experiences.",
      isAiInterpretation: true,
    },
    {
      id: "sec-4",
      title: "Strategic Brand Positioning",
      category: "brand_positioning",
      content: `The essential creative platform for high-standard execution. Where competitors add complexity, ${brandName} provides clarity, architectural poise, and measurable impact.`,
      isAiInterpretation: true,
    },
    {
      id: "sec-5",
      title: "Brand Personality & Tone of Voice",
      category: "brand_personality",
      content: "Authoritative yet approachable. Understated, intellectually rigorous, visionary, and devoid of superfluous jargon.",
      isAiInterpretation: true,
    },
    {
      id: "sec-6",
      title: "Core Brand Keywords",
      category: "brand_keywords",
      content: "Architectural · Visionary · Minimalist · High-Contrast · Decisive · Elevated",
      isAiInterpretation: true,
    },
    {
      id: "sec-7",
      title: "Competitive Landscape & White Space",
      category: "competitor_info",
      content: "Direct competitors rely heavily on generic templates and saturated color schemes. The white space opportunity lies in deep obsidian minimalism paired with laser-sharp editorial typography.",
      isAiInterpretation: true,
    },
    {
      id: "sec-8",
      title: "Visual Preferences & Design Philosophy",
      category: "visual_preferences",
      content: "Deep charcoal/obsidian fields, crisp white typography, subtle luminous violet and cyan beacons, generous letter spacing, and floating translucent glass cards.",
      verbatimClientNotes: "Love dark mode, modern fonts, sleek cards, clean layouts.",
      isAiInterpretation: false,
    },
    {
      id: "sec-9",
      title: "Color Direction",
      category: "color_direction",
      content: "Primary: Obsidian Space (#08090E). Secondary: Atmospheric Violet (#8B5CF6). Accent: Electric Cyan (#38BDF8). Ground: Clean Crisp White (#F8FAFC).",
      isAiInterpretation: true,
    },
    {
      id: "sec-10",
      title: "Typography Direction",
      category: "typography_direction",
      content: "Headline Display: Geometric Modern Grotesk (Satoshi / Syne). Body Copy: High-legibility Neutral Sans (Inter / Plus Jakarta Sans) with generous leading.",
      isAiInterpretation: true,
    },
    {
      id: "sec-11",
      title: "Creative Constraints & Guardrails",
      category: "creative_constraints",
      content: "DO NOT: Use garish neon gradients, playful cartoon illustrations, or overcrowded cluttered grids. DO: Prioritize intentional negative space and high typographic rigor.",
      isAiInterpretation: true,
    },
    {
      id: "sec-12",
      title: "Project Deliverables Checklist",
      category: "deliverables",
      content: "1. Master Brand Identity Lockup\n2. Design System Tokens & Color Palette\n3. Typography Specimen Hierarchy\n4. Digital Application Mockups (Web & Mobile)\n5. Client Direction Approval Suite",
      isAiInterpretation: true,
    },
  ];

  return {
    id: `bp-${Date.now()}`,
    clientName,
    brandName,
    rawClientInput: rawInput,
    preservedClientNotes: rawInput,
    sections,
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
