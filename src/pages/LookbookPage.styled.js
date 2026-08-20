import styled from "styled-components";

export const LookbookContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 50px 20px 34px 19px;

  box-sizing: border-box;
  overflow-y: auto;

  color: #f3eee3;

  background: linear-gradient(
    180deg,
    #222 0%,
    #222 58.173%,
    #d1ccc7 100%
  );

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const TopSection = styled.div`
  flex-shrink: 0;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;

  padding: 0;

  color: #f3eee3;
`;

export const LogoMain = styled.span`
  font-family: Georgia, "Times New Roman",
    serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
`;

export const Ampersand = styled.span`
  margin: 0 2px;
  padding-top: 9px;

  color: #8c6239;
  font-family: Georgia, "Times New Roman",
    serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
`;

export const Message = styled.p`
  margin: 74.6px 0 0;

  color: #e5e3e0;
  font-family: Pretendard, sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 140%;
  text-align: center;
`;

export const MuseInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;

  min-height: 14px;
  margin: 3px 0 7px;

  color: #a8a29d;
  font-size: 10px;
  line-height: 14px;
  letter-spacing: 0.04em;

  span:not(:last-child)::after {
    margin-left: 8px;
    content: "·";
  }
`;

export const ImageSection = styled.div`
  flex-shrink: 0;
  width: 100%;
  aspect-ratio: ${({ $width, $height }) =>
    $width > 0 && $height > 0
      ? `${$width} / ${$height}`
      : "4 / 5"};
`;

export const LookbookImage = styled.img`
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  background-color: #e4e4e7;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgb(0 0 0 / 25%);
`;

export const BottomSection = styled.div`
  flex-shrink: 0;
  padding-top: 20px;
`;

export const ActionRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 60px;
  gap: 12px;
`;

export const DownloadButton = styled.button`
  height: 60px;
  padding: 16px;

  color: #e5e3e0;
  font-family: Pretendard, sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 140%;

  background-color: #222;
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

  width: 60px;
  height: 60px;
  padding: 10px;

  background-color: #222;
  border: none;
  border-radius: 999px;
  cursor: pointer;

  &:active {
    background-color: #353535;
  }
`;

export const ShareIcon = styled.img`
  display: block;
  width: 22px;
  height: 24px;
`;

export const RetryDescription = styled.p`
  margin: 10px 0 4px;

  color: #e5e3e0;
  font-family: Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 300;
  line-height: 140%;
`;

export const RetryButton = styled.button`
  width: 100%;
  height: 60px;
  padding: 16px;

  color: #222;
  font-family: Pretendard, sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 140%;

  background-color: #e5e3e0;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    background-color: #fff;
  }
`;
