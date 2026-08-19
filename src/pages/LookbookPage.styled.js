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
      #202020 48%,
      #4a4845 74%,
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
  font-family: Georgia, "Times New Roman",
    serif;
  font-size: 31px;
  font-weight: 700;
  line-height: 1;
`;

export const Ampersand = styled.span`
  margin: 0 2px;
  padding-top: 10px;

  color: #8c6239;
  font-family: Georgia, "Times New Roman",
    serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
`;

export const Message = styled.p`
  margin: 42px 0 10px;

  color: #e5e3e0;
  font-family: Pretendard, sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 140%;
  text-align: center;
`;

export const MuseInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;

  margin-bottom: 16px;

  color: #a8a29d;
  font-size: 10px;
  letter-spacing: 0.04em;

  span:not(:last-child)::after {
    margin-left: 8px;
    content: "·";
  }
`;

export const ImageSection = styled.div`
  width: 100%;
`;

export const LookbookImage = styled.img`
  display: block;

  width: 100%;
  aspect-ratio: 4 / 5;

  object-fit: cover;

  background-color: #e6e6e8;
  border-radius: 10px;
`;

export const MoodSection = styled.section`
  padding: 18px 4px 4px;

  text-align: center;
`;

export const MoodName = styled.h2`
  margin: 0;

  color: #f3eee3;
  font-family: Georgia, "Times New Roman",
    serif;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.08em;
`;

export const MoodReason = styled.p`
  margin: 7px 0 0;

  color: rgb(255 255 255 / 68%);
  font-size: 11px;
  line-height: 150%;
`;

export const Palette = styled.div`
  display: flex;
  justify-content: center;
  gap: 7px;

  margin-top: 10px;
`;

export const PaletteColor = styled.span`
  display: block;

  width: 18px;
  height: 18px;

  background-color: ${({ $color }) =>
    $color};
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 50%;
`;

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  margin-top: 16px;
  padding: 15px 8px;

  background-color: rgb(0 0 0 / 12%);
  border-radius: 12px;
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  &:not(:last-child) {
    border-right: 1px solid
      rgb(255 255 255 / 14%);
  }
`;

export const StatValue = styled.strong`
  color: #f3eee3;
  font-size: 17px;
`;

export const StatLabel = styled.span`
  margin-top: 4px;

  color: rgb(255 255 255 / 62%);
  font-size: 10px;
`;

export const BottomSection = styled.div`
  flex-shrink: 0;
  padding-top: 16px;
`;

export const ActionRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

export const ShareFileButton = styled.button`
  min-height: 54px;
  padding: 0 12px;

  color: #e5e3e0;
  font-family: Pretendard, sans-serif;
  font-size: 13px;
  font-weight: 600;

  background-color: #202020;
  border: none;
  border-radius: 17px;
  cursor: pointer;

  &:active {
    background-color: #353535;
  }
`;

export const DownloadButton = styled.button`
  min-height: 54px;
  padding: 0 12px;

  color: #e5e3e0;
  font-family: Pretendard, sans-serif;
  font-size: 13px;
  font-weight: 600;

  background-color: #202020;
  border: none;
  border-radius: 17px;
  cursor: pointer;

  &:active {
    background-color: #353535;
  }
`;

export const HomeButton = styled.button`
  width: 100%;
  height: 50px;
  margin-top: 10px;

  color: #333;
  font-size: 14px;
  font-weight: 600;

  background-color: rgb(250 249 247 / 90%);
  border: none;
  border-radius: 17px;
  cursor: pointer;
`;

export const RetryDescription = styled.p`
  margin: 16px 2px 7px;

  color: rgb(255 255 255 / 65%);
  font-family: Pretendard, sans-serif;
  font-size: 11px;
  line-height: 140%;
`;

export const RetryButton = styled.button`
  width: 100%;
  height: 50px;

  color: #333;
  font-family: Pretendard, sans-serif;
  font-size: 15px;
  font-weight: 600;

  background-color: rgb(250 249 247 / 90%);
  border: none;
  border-radius: 17px;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    background-color: #fff;
  }
`;