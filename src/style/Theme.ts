// import { DefaultTheme } from "styled-components";

// export const theme: DefaultTheme = {
//   red: "#E51013",
//   black: {
//     veryDark: "#141414",
//     darker: "#181818",
//     lighter: "#2F2F2F",
//   },
//   white: {
//     lighter: "#fff",
//     darker: "#e5e5e5",
//   },
// };

const calcRem = (size: number) => `${size / 16}rem`;

const fontSizes = {
  xs: calcRem(12),
  small: calcRem(14),
  base: calcRem(16),
  lg: calcRem(18),
  xl: calcRem(20),
  xxl: calcRem(24),
  titleSize: calcRem(32),
};

// const fontWeights = {
//   thin: "200",
//   light: "300",
//   regular: "400",
//   bold: "500",
//   semiBold: "600",
//   extraBold: "700",
// };

const paddings = {
  small: calcRem(4),
  base: calcRem(8),
  large: calcRem(16),
  xl: calcRem(20),
  xxl: calcRem(24),
  xxxl: calcRem(40),
};

const margins = {
  small: calcRem(4),
  base: calcRem(8),
  large: calcRem(16),
  xl: calcRem(20),
  xxl: calcRem(24),
  xxxl: calcRem(40),
};

const colors = {
  green: "#41b979",
  red: "#ef6253",
  black: "#222222",
  darkGray: "#4D4D4D",
  gray: "#8E8E8E",
  lightGray: "#f8f9fa",
  disabled: "#ebebeb",
  white: "#ffffff",
  purple: "#342461",
  violet: "#B143AF",
  mint: "#1EC997",
  blue: "#3366FF",
};

const borders = {
  gray: "1px solid #d3d3d3",
  lightGray: "1px solid #ebebeb",
};

// const flex = {
//   flexBox: (direction = "row", align = "center", justify = "center") => `
//     display: flex;
//     flex-direction: ${direction};
//     align-items: ${align};
//     justify-content: ${justify};
//   `,
// };

const theme = {
  fontSizes,
  paddings,
  margins,
  colors,
  borders,
};

export default theme;
