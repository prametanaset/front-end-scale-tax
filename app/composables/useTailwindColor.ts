export type ThemeKey =
  | "primary"
  | "secondary"
  | "warning"
  | "success"
  | "danger"
  | "info"
  | "default";

export function useTailwindColor(theme: ThemeKey): string {
  const themeToClassMap: Record<string, string> = {
    primary: "text-primary",
    secondary: "text-secondary",
    warning: "text-yellow-400",
    success: "text-green-500",
    danger: "text-red-500",
    info: "text-sky-500",
    default: "text-gray-400",
  };

  // Fix: Let TypeScript know this is always a string
  const className = (themeToClassMap[theme] ??
    themeToClassMap["default"]) as string;

  const el = document.createElement("div");
  el.className = className;
  el.style.display = "none";
  document.body.appendChild(el);

  const color = getComputedStyle(el).color;
  document.body.removeChild(el);

  return color;
}
