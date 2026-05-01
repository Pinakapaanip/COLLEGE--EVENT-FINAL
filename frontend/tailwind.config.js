export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      },
      colors: {
        ink: "#08111f",
        panel: "rgba(15, 23, 42, 0.72)"
      },
      boxShadow: {
        glass: "0 24px 80px rgba(2, 6, 23, 0.42)"
      }
    }
  },
  plugins: []
};
