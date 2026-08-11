import Header from "../Header/Header";
import * as S from "./MobileLayout.styled";

function MobileLayout({ children }) {
  return (
    <S.PageBackground>
      <S.MobileContainer>
        <Header />

        <S.MainContent>
          {children}
        </S.MainContent>
      </S.MobileContainer>
    </S.PageBackground>
  );
}

export default MobileLayout;