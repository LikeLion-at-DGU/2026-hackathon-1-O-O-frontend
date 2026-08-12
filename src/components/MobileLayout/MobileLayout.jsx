import Header from "../Header/Header";
import * as S from "./MobileLayout.styled";

function MobileLayout({ children, showHeader = true }) {
  return (
    <S.PageBackground>
      <S.MobileContainer>
        {showHeader && <Header />}

        <S.MainContent $showHeader={showHeader}>
          {children}
        </S.MainContent>
      </S.MobileContainer>
    </S.PageBackground>
  );
}

export default MobileLayout;