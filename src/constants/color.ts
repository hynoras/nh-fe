export const themePalette = {
  light: {
    default: "#ECECEF",

    background: {
      canvas: "#F3F4F6", // Main app backdrop (Tailwind gray-100)
      surface: "#E5E7EB", // Sidebars, Topbars, and main layout structures
      card: "#FEFEFE", // Content containers & Data tables
      popover: "#FFFFFF" // Dropdowns, Modals, and Tooltips
    },
    borders: {
      subtle: "#E5E7EB", // Dividers between layouts (Tailwind gray-200)
      muted: "#D1D5DB" // Focused or more prominent border lines
    },

    navigation: {
      sidebarBg: "#F9F9F9",
      textIdle: "#6B7280", // Resting menu items
      textHover: "#111827", // Hover state
      textActive: "#3F0087", // Active state matching primary
      accentBar: "#3F0087" // Left-edge active indicator line
    },

    typography: {
      h1: { color: "#111827" },
      h2: { color: "#111827" },
      h3: { color: "#1F2937" },
      h4: { color: "#1F2937" },
      h5: { color: "#374151" },
      h6: { color: "#374151" },
      subtitle1: { color: "#4B5563" },
      subtitle2: { color: "#6B7280" },
      body1: { color: "#1F2937" },
      body2: { color: "#6B7280" },
      caption: { color: "#9CA3AF" },
      overline: { color: "#6B7280" }
    },

    primary: {
      main: "#3F0087",
      hover: "#2A0057",
      active: "#1A0033",
      disabled: "rgba(63, 0, 135, 0.3)"
    },
    secondary: {
      main: "#6366F1",
      hover: "#4F46E5",
      active: "#3730A3",
      disabled: "rgba(99, 102, 241, 0.3)"
    },
    tertiary: {
      main: "#06B6D4",
      hover: "#0891B2",
      active: "#06536F",
      disabled: "rgba(6, 182, 212, 0.3)"
    },

    error: {
      main: "#DC2626",
      hover: "#B91C1C",
      active: "#991B1B",
      disabled: "rgba(220, 38, 38, 0.3)"
    },
    warning: {
      main: "#D97706",
      hover: "#B45309",
      active: "#92400E",
      disabled: "rgba(217, 119, 6, 0.3)"
    },
    success: {
      main: "#059669",
      hover: "#047857",
      active: "#065F46",
      disabled: "rgba(5, 150, 105, 0.3)"
    },
    info: {
      main: "#2563EB",
      hover: "#1D4ED8",
      active: "#1E40AF",
      disabled: "rgba(37, 99, 235, 0.3)"
    }
  },

  dark: {
    default: "#141414",

    background: {
      canvas: "#18181B", // Deep off-black base layout shell
      surface: "#16161A", // Sidebar, Navigation Headers, Layout Shells
      card: "#1E1E24", // Data widgets, panels, and grid containers
      popover: "#25252B" // Context menus, modal overlays, tooltips
    },
    borders: {
      subtle: "#2A2A32", // Dark grid-lines and clean panel dividers
      muted: "#3F3F4C" // Active input rings or interactive borders
    },

    navigation: {
      sidebarBg: "#16161A",
      textIdle: "#8B93A1",
      textHover: "#F5F7FA",
      textActive: "#FFFFFF",
      accentBar: "#22C7E8" // Clean contrast teal bar for active menu line
    },

    typography: {
      h1: { color: "#F5F7FA" },
      h2: { color: "#ECEFF4" },
      h3: { color: "#ECEFF4" },
      h4: { color: "#DDE2EA" },
      h5: { color: "#DDE2EA" },
      h6: { color: "#DDE2EA" },
      subtitle1: { color: "#C7CAD1" },
      subtitle2: { color: "#A7AFBD" },
      body1: { color: "#D6DAE1" },
      body2: { color: "#9AA3B2" },
      caption: { color: "#7B8494" },
      overline: { color: "#8B93A1" }
    },

    primary: {
      main: "#6D5EF6",
      hover: "#584AD9",
      active: "#4438BC",
      disabled: "rgba(109, 94, 246, 0.3)"
    },
    secondary: {
      main: "#8B92FF",
      hover: "#7279E6",
      active: "#5A60CC",
      disabled: "rgba(139, 146, 255, 0.3)"
    },
    tertiary: {
      main: "#22C7E8",
      hover: "#1BA4C0",
      active: "#148199",
      disabled: "rgba(34, 199, 232, 0.3)"
    },

    error: {
      main: "#F05D5E",
      hover: "#D64546",
      active: "#BD3031",
      disabled: "rgba(240, 93, 94, 0.3)"
    },
    warning: {
      main: "#E9B949",
      hover: "#CFA134",
      active: "#B58A22",
      disabled: "rgba(233, 185, 73, 0.3)"
    },
    success: {
      main: "#27C281",
      hover: "#1FA36B",
      active: "#178556",
      disabled: "rgba(39, 194, 129, 0.3)"
    },
    info: {
      main: "#4C8DFF",
      hover: "#3473E6",
      active: "#205ACC",
      disabled: "rgba(76, 141, 255, 0.3)"
    }
  }
} as const

export type ThemePalette = typeof themePalette
