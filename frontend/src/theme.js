const common = {
    fonts: {
        ui: "'Outfit', sans-serif",
        title: "'Playfair Display', serif",
    },
    shadows: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    }
};

export const lightTheme = {
    ...common,
    colors: {
        primary: "#0f1724",
        secondary: "#1e293b",
        bg: "#ffffff",
        panel: "#f8fafc",
        muted: "#64748B",
        accent1: "#00c2b3",
        accent2: "#ff6b6b",
        glass: "rgba(255,255,255,0.8)",
        border: "#e2e8f0",
        text: "#1e293b",
        heading: "#0f1724",
    }
};

export const darkTheme = {
    ...common,
    colors: {
        primary: "#ffffff",
        secondary: "#e2e8f0",
        bg: "#0f1724",
        panel: "#1e293b",
        muted: "#94a3b8",
        accent1: "#00c2b3",
        accent2: "#ff6b6b",
        glass: "rgba(15, 23, 36, 0.8)",
        border: "#334155",
        text: "#f1f5f9",
        heading: "#ffffff",
    }
};

export default lightTheme;
