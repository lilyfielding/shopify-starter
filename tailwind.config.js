const spacing = {
  0: "0",
  4: "0.25rem",
  6: "2.67rem",
  8: "0.5rem",
  12: "0.75rem",
  16: "1rem",
  24: "1.5rem",
  32: "2rem",
  40: "2.5rem",
  48: "3rem",
  64: "4rem",
  72: "4.5rem",
  80: "5rem",
  88: "5.5rem",
  96: "6rem",
  104: "6.5rem",
  128: "8rem",
  160: "10rem",
  320: "20rem",
  400: "25rem",
  480: "30rem",
  560: "35rem",
  640: "40rem",
};

module.exports = {
  purge: [
    "./layout/*.liquid",
    "./templates/*.liquid",
    "./sections/*.liquid",
    "./snippets/*.liquid",
  ],
  important: false,
  theme: {
    fontFamily: {
      body: ['"Roboto Mono"', "sans-serif"],
    },
    colors: {
      transparent: "transparent",
      black: "#000",
      white: "#fff",
      accent: "#f8d0a9",
      bkgmain: "#fff",
      bkgaccent: "#fdf9ec",
    },
    container: false,
    spacing: spacing,
    inset: spacing,
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1281px",
    },
    extend: {
      transitionProperty: {
        height: "height",
        width: "width",
      },
    },
  },
  variants: {
    padding: ["responsive", "first", "last"],
    margin: ["responsive", "first", "last"],
    borderWidth: ["responsive", "first", "last"],
    display: ["responsive", "first", "last"],
    translate: ["responsive", "hover", "group-hover"],
  },
  plugins: [
    ({ addComponents, theme }) => {
      addComponents({
        ".container": {
          margin: "0 auto",
          padding: "0 1rem",
          maxWidth: "100%",
          "@screen md": {
            padding: "0 2rem",
          },
          "@screen lg": {
            padding: "0 3rem",
          },
          "@screen xl": {
            maxWidth: "1920px",
          },
        },
      });
    },
  ],
};
