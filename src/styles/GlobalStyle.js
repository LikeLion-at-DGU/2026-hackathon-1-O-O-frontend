import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  /* 전체에 적용할 CSS */

a {
    color: inherit;
    text-decoration: none;
}

body {
    margin: 0;
    /* Pretendard Variable은 index.html에서 로드한다. 개별 컴포넌트의
       font-family: Pretendard 선언이 이 스택으로 폴백된다. */
    font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont,
        "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
}

`;

export default GlobalStyle;