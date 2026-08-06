import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  /* 전체에 적용할 CSS */

a {
    color: inherit;
    text-decoration: none;
}

body {
    margin: 0;
}

`;

export default GlobalStyle;