import Header from "../Header/Header";
import * as S from "./MobileLayout.styled";

function MobileLayout({
  children,
  hideShoot = false,
  showHeader = true,
  header = <Header hideShoot={hideShoot} />,
}) {
  return (
    <S.PageBackground>
      <S.MobileContainer>
        {showHeader && header}
        <S.MainContent $showHeader={showHeader}>
          {children}
        </S.MainContent>
      </S.MobileContainer>
    </S.PageBackground>
  );
}

export default MobileLayout;