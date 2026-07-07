// src/theme/theme.ts

export const Colors = {
  background: "#0B0B0D", // Main background everywhere [cite: 82, 83]
  surface: "#151518",    // Cards, bottom sheets, dialogs [cite: 84, 85, 87, 88]
  card: "#1D1D21",       // Floating cards elevated surface [cite: 89, 91]
  border: "#2B2B30",     // Very subtle borders [cite: 92, 94]
  text: "#FFFFFF",       // Primary text [cite: 95, 96]
  secondary: "#B7BBC5",  // Secondary text [cite: 97, 98]
  disabled: "#6D7078",   // Disabled text states [cite: 99, 100]
  accent: "#4B82FF",     // Progress charts and highlights only [cite: 105, 108]
  success: "#35C759",    // Success states [cite: 111, 112]
  warning: "#FFCC00",    // Warning indicators [cite: 113, 114]
  danger: "#FF453A",     // Only for actual errors [cite: 115, 117]
  buttonText: "#000000", // Text color for primary button [cite: 101, 104]
};

export const Spacing = {
  xs: 4,   // 8px system sub-step [cite: 252, 373]
  sm: 8,   // Base layout spacing [cite: 252, 373]
  md: 12,  // Element grouping gap [cite: 373]
  lg: 16,  // Standard padding [cite: 373]
  xl: 24,  // Card internal padding [cite: 373]
  xxl: 32, // Section block spacing [cite: 373]
  xxxl: 48, // Large structural breaks [cite: 373]
  xxxxl: 64, // Extended safe-area padding [cite: 373]
};

export const BorderRadius = {
  sm: 12,   // Subtle elements [cite: 374]
  inputs: 16, // Input fields [cite: 135, 374]
  buttons: 18, // Interactive buttons [cite: 134]
  cards: 24,  // Standard components and cards [cite: 131, 234, 252, 374]
  xl: 32,   // Hero dashboards [cite: 271, 374]
  full: 999, // Small chips and circular profiles [cite: 137, 374]
};

export const Typography = {
  fontFamily: "Inter", // Core brand typeface [cite: 120, 252, 374]
  sizes: {
    display: 40,  // Hero screens metrics [cite: 129]
    heading: 30,  // Screen titles [cite: 129]
    title: 22,    // Sub-sections [cite: 129]
    subtitle: 18, // Card headers [cite: 129]
    body: 16,     // Readable copy [cite: 129]
    small: 14,    // Explanatory texts [cite: 129]
    caption: 12,  // Timestamps and metadata [cite: 129]
  },
  weights: {
    regular: "400",  // Default body copy [cite: 122, 374]
    medium: "500",   // Medium emphasis [cite: 123, 374]
    semibold: "600", // High emphasis labels [cite: 124, 374]
    bold: "700",     // Main structural headings [cite: 125, 374]
  } as const,
};