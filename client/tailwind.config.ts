import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // --- Nexi Theme Colors ---
        'nexi': {
          'blue': '#2d32aa',
          'darkblue': '#191e80',
          'blackgray': '#323232',
          'darkgray': '#747678',
          'gray': '#b2b4b3',
          'lightgray': '#e0e1dd',
          'pagebg': '#f6f7f9',
        },

        // --- Header Specific Colors ---
        'header': {
          'bg': 'rgba(255, 255, 255, 0.95)',
          'border': 'rgba(0, 0, 0, 0.08)',
          'text': '#111827',
          'primary': '#4f46e5',
          'primary-dark': '#4338ca',
        },

        // --- Your Original HSL Colors ---
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        sora: ["Sora", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
      },
      height: {
        'header': '64px',
      },
      spacing: {
        'header': '64px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        noise: {
          "0%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-5%,-5%)" },
          "20%": { transform: "translate(-10%,5%)" },
          "30%": { transform: "translate(5%,-10%)" },
          "40%": { transform: "translate(-5%,15%)" },
          "50%": { transform: "translate(-10%,5%)" },
          "60%": { transform: "translate(15%,0)" },
          "70%": { transform: "translate(0,10%)" },
          "80%": { transform: "translate(-10%,10%)" },
          "90%": { transform: "translate(10%,5%)" },
          "100%": { transform: "translate(5%,0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float-slow": "float 6s ease-in-out infinite",
        "float-medium": "float 4s ease-in-out infinite",
        "float-fast": "float 2s ease-in-out infinite",
        "fade-in": "fade-in 0.6s ease-out",
        "fade-up": "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slide-down 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slide-up 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        noise: "noise 1s steps(8) infinite",
      },
      backgroundImage: {
        "noise-pattern":
          "url('data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)' opacity='0.20'/%3E%3C/svg%3E')",
        "radial-gradient":
          "radial-gradient(ellipse at center, var(--tw-gradient-stops))",
      },
      boxShadow: {
        soft: "0 4px 24px rgba(0, 0, 0, 0.05)",
        "soft-dark": "0 4px 24px rgba(0, 0, 0, 0.2)",
        glow: "0 0 10px 2px rgba(255, 255, 255, 0.1)",
        "glow-dark": "0 0 15px 3px rgba(0, 0, 0, 0.2)",
        "dropdown": "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
        "header": "0 4px 12px rgba(0, 0, 0, 0.05)",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
        "opacity-transform": "opacity, transform",
        "header": "background-color, box-shadow, border-color",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        elastic: "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
        "header": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      backdropBlur: {
        header: "12px",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    function ({ addUtilities }) {
      const newUtilities = {
        ".text-balance": {
          "text-wrap": "balance",
        },
        ".perspective-1000": {
          perspective: "1000px",
        },
        ".preserve-3d": {
          transformStyle: "preserve-3d",
        },
        ".backface-hidden": {
          backfaceVisibility: "hidden",
        },
        ".noise-bg": {
          backgroundImage: "var(--noise-pattern)",
        },
        ".header-blur": {
          backdropFilter: "blur(12px)",
          "-webkit-backdrop-filter": "blur(12px)",
        },
      };
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;