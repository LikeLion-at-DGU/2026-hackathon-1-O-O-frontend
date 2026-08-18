import styled from "styled-components";

export const LookbookContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  min-height: 100dvh;
  padding: 42px 20px 26px;

  box-sizing: border-box;
  color: #f3eee3;

  background:
    linear-gradient(
      180deg,
      #202020 0%,
      #202020 51%,
      #4a4845 77%,
      #c9c5bf 100%
    );
`;

export const TopSection = styled.div`
  flex-shrink: 0;
`;

export const Logo = styled.button`
  display: inline-flex;
  align-items: center;

  padding: 0;

  color: #f3eee3;
  background: none;
  border: none;
  cursor: pointer;
`;

export const LogoMain = styled.span`
  font-family: Georgia, "Times New Roman", serif;
  font-size: 31px;
  font-weight: 700;
  line-height: 1;
`;

export const Ampersand = styled.span`
  margin: 0 2px;
  padding-top: 10px;

  color: #8c6239;

  font-family: Georgia, "Times New Roman", serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
`;

export const Message = styled.p`
  margin: 62px 0 18px;

  color: #E5E3E0;
  font-family: Pretendard;
  font-size: var(--Font-size-XL, 20px);
  font-weight: 400;
  line-height: 140%;
  text-align: center;
`;

export const ImageSection = styled.div`
  flex: 1;
  min-height: 0;
`;

export const LookbookImage = styled.img`
  display: block;

  width: 100%;
  height: 100%;
  min-height: 340px;
  max-height: 470px;

  object-fit: cover;

  background-color: #e6e6e8;
  border-radius: 10px;
`;

export const BottomSection = styled.div`
  flex-shrink: 0;
  padding-top: 15px;
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 12px;
`;

export const DownloadButton = styled.button`
  flex: 1;
  height: 58px;

  color: #e5e3e0;
  font-family: Pretendard, sans-serif;
  font-size: 16px;
  font-weight: 600;

  background-color: #202020;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  &:active {
    background-color: #353535;
  }
`;

export const ShareButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 58px;
  height: 58px;
  flex-shrink: 0;

  color: #ffffff;
  background-color: #202020;
  border: none;
  border-radius: 50%;
  cursor: pointer;

  &:active {
    background-color: #353535;
  }
`;

export const RetryDescription = styled.p`
  margin: 10px 2px 7px;

  color: rgba(255, 255, 255, 0.65);
  font-family: Pretendard, sans-serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 140%;
`;

export const RetryButton = styled.button`
  width: 100%;
  height: 50px;

  color: #333333;
  font-family: Pretendard, sans-serif;
  font-size: 16px;
  font-weight: 600;

  background-color: rgba(250, 249, 247, 0.9);
  border: none;
  border-radius: 17px;
  cursor: pointer;

  &:active {
    background-color: #ffffff;
  }
`;