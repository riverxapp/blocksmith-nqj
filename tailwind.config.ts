We need to update tailwind.config.ts with extended theme colors for CRM branding: primary, success, warning, danger, gray shades. The current config already has custom colors for border, input, ring, background, foreground, primary, secondary, destructive, muted, accent, popover, card. But to add success, warning, and gray shades, and also rename or adjust existing ones? The request: "Set up Tailwind config with extended theme colors for CRM branding (primary, success, warning, danger, gray shades)." The current config already has primary and destructive (danger). We need to add success, warning, and gray shades. The gray shades might be already covered by the existing muted, but we can add explicit gray scale. However, the instruction says "extended theme colors for CRM branding". We should add success and warning colors, and perhaps a gray custom scale. But careful: The existing config uses HSL variables for all colors. To be consistent, we can add success and warning as additional color keys with their own HSL variables. But we don't have the CSS variables defined yet (in globals.css). However, the task is only to update tailwind.config.ts. We can assume that the CSS variables for success and warning will be defined later or we can add them to the config using HSL references like primary. For gray shades, we could add a custom `gray` scale like `50: "#f9fafb"` etc., but the instruction says "gray shades" which may mean a range of gray colors. But since we are using HSL variables, we can't easily add a numeric scale with HSL variable unless we create separate variables. To keep it simple and aligned with shadcn/ui pattern, we can add success and warning as new color keys with DEFAULT and foreground, using HSL variables. For gray, we can add a `gray` key with a set of shades, but that might conflict with Tailwind's built-in gray. Alternatively, we can add them as custom colors using HSL references. To be safe, I'll add:

- success: { DEFAULT: "hsl(var(--success))", foreground: "hsl(var(--success-foreground))" }
- warning: { DEFAULT: "hsl(var(--warning))", foreground: "hsl(var(--warning-foreground))" }
- And also ensure gray shades are present. Since the request says "gray shades", maybe we need a range like 50, 100, etc. But the repo may not have those CSS variables. Possibly the intent is to have CRM-specific colors. Maybe we can add a `gray` scale using custom hex values? But the repo uses HSL variables for theming. To be consistent, we could add a custom gray scale like 'gray-50' etc. but that would be many entries. Alternatively, maybe the existing "muted" and "border" serve as gray. The request explicitly says "gray shades", so I'll add a custom gray palette under `colors.gray` as an object with values from 50 to 900. However, that will override Tailwind's built-in gray, which might be fine. But we must ensure the file content is valid. I'll use typical gray hex values. But the instruction says to preserve unrelated logic, so we should only add the missing colors, not remove existing. We also have to output only the final file content.

Given the unified plan instruction, we need to produce a deterministic change. I'll add success, warning, and gray shades. For gray, I'll add numeric shades using hex values (common palette). But note: if the existing theme uses CSS variables for colors, adding hardcoded hex grays might break consistency. However, the request is to set up extended theme colors for CRM branding, so it's acceptable. Alternatively, we could add a 'gray' key with a single DEFAULT using a CSS variable, but that doesn't give shades. The request says "gray shades" likely means a range, so I'll add a custom gray scale.

I'll also ensure the primary is already there, success and warning are added, and danger is already destructive. Also maybe add a `danger` alias for destructive? But not necessary.

Thus, the updated tailwind.config.ts will include:

```
colors: {
  // existing colors...
  success: {
    DEFAULT: "hsl(var(--success))",
    foreground: "hsl(var(--success-foreground))",
  },
  warning: {
    DEFAULT: "hsl(var(--warning))",
    foreground: "hsl(var(--warning-foreground))",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
},
```

But also need to be careful: the existing config uses `@tailwindcss/typography` plugin. That's unrelated, so keep it.

Also, we might need to update the content paths to include the new CRM pages? Not required in this task.

We'll output the full file with added colors. Ensure no markdown or code fences.

The output must be the raw file content.
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;