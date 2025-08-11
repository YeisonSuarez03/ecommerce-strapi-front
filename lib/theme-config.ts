// Configuración del tema de la aplicación
export const themeConfig = {
  colors: {
    primary: {
      DEFAULT: "rgb(var(--color-primary))",
      hover: "rgb(var(--color-primary-hover))",
    },
    secondary: {
      DEFAULT: "rgb(var(--color-secondary))",
      hover: "rgb(var(--color-secondary-hover))",
    },
    default: {
      DEFAULT: "rgb(var(--color-default))",
      hover: "rgb(var(--color-default-hover))",
    },
    success: "rgb(var(--color-success))",
    error: "rgb(var(--color-error))",
    warning: "rgb(var(--color-warning))",
    info: "rgb(var(--color-info))",
  },
  fontSize: {
    "custom-xs": "var(--font-size-xs)",
    "custom-sm": "var(--font-size-sm)",
    "custom-base": "var(--font-size-base)",
    "custom-lg": "var(--font-size-lg)",
    "custom-xl": "var(--font-size-xl)",
    "custom-2xl": "var(--font-size-2xl)",
    "custom-3xl": "var(--font-size-3xl)",
  },
  spacing: {
    "custom-xs": "var(--spacing-xs)",
    "custom-sm": "var(--spacing-sm)",
    "custom-md": "var(--spacing-md)",
    "custom-lg": "var(--spacing-lg)",
    "custom-xl": "var(--spacing-xl)",
  },
  borderRadius: {
    "custom-sm": "var(--border-radius-sm)",
    "custom-md": "var(--border-radius-md)",
    "custom-lg": "var(--border-radius-lg)",
    "custom-xl": "var(--border-radius-xl)",
  },
}

// Función para cambiar el tema dinámicamente
export const updateTheme = (newColors: {
  primary?: string
  secondary?: string
  default?: string
}) => {
  const root = document.documentElement

  if (newColors.primary) {
    root.style.setProperty("--color-primary", newColors.primary)
  }
  if (newColors.secondary) {
    root.style.setProperty("--color-secondary", newColors.secondary)
  }
  if (newColors.default) {
    root.style.setProperty("--color-default", newColors.default)
  }
}

// Agregar más temas predefinidos al objeto themes

// Temas predefinidos
export const themes = {
  default: {
    primary: "30 41 59", // slate-800
    secondary: "37 99 235", // blue-600
    default: "71 85 105", // slate-600
  },
  blue: {
    primary: "29 78 216", // blue-700
    secondary: "59 130 246", // blue-500
    default: "71 85 105", // slate-600
  },
  green: {
    primary: "21 128 61", // green-700
    secondary: "34 197 94", // green-500
    default: "71 85 105", // slate-600
  },
  purple: {
    primary: "126 34 206", // purple-700
    secondary: "168 85 247", // purple-500
    default: "71 85 105", // slate-600
  },
  red: {
    primary: "185 28 28", // red-700
    secondary: "239 68 68", // red-500
    default: "71 85 105", // slate-600
  },
  orange: {
    primary: "194 65 12", // orange-700
    secondary: "249 115 22", // orange-500
    default: "71 85 105", // slate-600
  },
  pink: {
    primary: "190 24 93", // pink-700
    secondary: "236 72 153", // pink-500
    default: "71 85 105", // slate-600
  },
  indigo: {
    primary: "67 56 202", // indigo-700
    secondary: "99 102 241", // indigo-500
    default: "71 85 105", // slate-600
  },
}

// Agregar funciones para manejar localStorage al final del archivo

// Función para guardar el tema en localStorage
export const saveThemeToStorage = (themeName: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("selected-theme", themeName)
  }
}

// Función para cargar el tema desde localStorage
export const loadThemeFromStorage = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("selected-theme") || "default"
  }
  return "default"
}

// Función para aplicar un tema por nombre
export const applyTheme = (themeName: string) => {
  const theme = themes[themeName as keyof typeof themes]
  if (theme) {
    updateTheme(theme)
    saveThemeToStorage(themeName)
    return true
  }
  return false
}

// Función para inicializar el tema al cargar la aplicación
export const initializeTheme = () => {
  const savedTheme = loadThemeFromStorage()
  applyTheme(savedTheme)
  return savedTheme
}
