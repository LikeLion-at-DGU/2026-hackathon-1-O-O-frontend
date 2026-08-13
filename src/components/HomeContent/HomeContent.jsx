import * as S from "./HomeContent.style";
import GreetingBear from "../../assets/hello.png";

function HomeContent() {
  return (
    <S.Container>
      <S.Greeting>
        <S.Title>
          반갑습니다.
          <br />
          <S.MCM>MCM</S.MCM>{" "}
          <S.Place>롯데백화점 잠실점</S.Place>의
          <br />
          방문을 환영합니다.
        </S.Title>

        <S.GreetingBear src={GreetingBear} alt="" />
      </S.Greeting>

      <S.SubTitle>
        F/W 소개
      </S.SubTitle>

      <S.Description>
        회고적이면서도 미래지향적인 2026 가을-겨울 컬렉션은 뮌헨의
        <br />
        문화와 음악을 통해 MCM 50주년을 기념하며, 최첨단 소재와 미래
        <br />
        지향적인 스타일을 조화롭게 담아냈습니다. 스터드 디테일의 실루엣
        <br />
        과 혁신적인 가죽 제품은 예술과 기술, 여행이 교차하는 하우스의
        <br />
        정체성을 드러냅니다.
      </S.Description>

      <S.SubTitle>
        MCM 소개
      </S.SubTitle>

      <S.Section>
        <S.SectionTitle>뮌헨에서 시작된 아이콘</S.SectionTitle>

        <S.Text>
          1976년 뮌헨의 황금기에 탄생한 MCM은 자유로운 제트족과
          문화적 선구자들의 사랑을 받으며 글로벌 럭셔리 브랜드로
          자리 잡았습니다.
          MCM의 오리지널 로고는 승리와 용기, 명예를 상징하는 월계수잎과
          브랜드의 모태인 'Modern Creation München'을 결합해 탄생했습니다.
          여기에 바이에른 국기에서 영감을 받은 다이아몬드 패턴과
          코냑 컬러가 어우러진 시그니처 '비세토스(Visetos)'는
          시대를 초월하여 변치 않는 MCM만의 아이콘으로 사랑받고 있습니다.
        </S.Text>

        <S.SectionTitle>기능을 따르는 장인정신</S.SectionTitle>

        <S.Text>
          MCM 디자인의 중심에는 "형태는 기능을 따른다"는 바우하우스
          철학이 깊게 뿌리내려 있습니다.
          독일 엔지니어링의 정밀함과 섬세한 장인정신을 바탕으로,
          현대 노마드(Nomad)의 유연한 라이프스타일에 최적화된
          핸즈프리(Hand-free) 실용성을 제안합니다.
          어디로든 자유롭게 이동하는 현대인들을 위해 최상의 소재와
          의도된 디테일로 완성된 감각적인 디자인을 선보입니다.
        </S.Text>

        <S.SectionTitle>문화적 대화와 지속 가능한 미래</S.SectionTitle>

        <S.Text>
          MCM은 음악, 스포츠, 예술 전반을 아우르며 끊임없이 혁신적인
          문화적 대화를 이어갑니다.
          빌리 아일리시, 베어브릭, 비욘세 등 시대를 대표하는 아티스트들과의
          대담한 협업은 MCM이 가진 독창적인 에너지의 원동력입니다.
          나아가 에코닐, 미리움 등 대안 친환경 소재 탐구와 순환 디자인을
          통해 국제 인증을 획득하며, 환경과 사회에 책임감을 다하는
          지속 가능한 패션의 미래를 열어가고 있습니다.
        </S.Text>
      </S.Section>
    </S.Container>
  );
}

export default HomeContent;