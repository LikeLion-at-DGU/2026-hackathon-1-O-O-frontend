import MobileLayout from "../components/MobileLayout/MobileLayout";
import ChatMessage from "../components/ChatMessage/ChatMessage";
import bearImage from "../assets/bear.png";
import { Chat } from "../components/Layout/Layout.styled";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";

function ChatPage() {

    const navigate = useNavigate();

  return (
    <MobileLayout header={<Header theme="light" />}>
        <ChatWrapper>
        <ChatMessage
                    type="assistant"
                    profileImage={bearImage}
                >
                    저와 함께 MCM을 경험해 보아요!
                    <br />
                    각 상품을 눌러 궁금한 점을 알아보세요.
                </ChatMessage>

                <ChatMessage type="user">
                    1번 진열대 클릭
                </ChatMessage>
        </ChatWrapper>

        <BackChat  onClick={() => navigate(-1)}>
                돌아가기
        
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="8"
                  viewBox="0 0 11 8"
                  fill="none"
                >
                  <path
                    d="M0.5 3.18213C0.223858 3.18213 0 3.40599 0 3.68213C0 3.95827 0.223858 4.18213 0.5 4.18213V3.68213V3.18213ZM10.8536 4.03568C11.0488 3.84042 11.0488 3.52384 10.8536 3.32858L7.67157 0.146595C7.47631 -0.0486672 7.15973 -0.0486672 6.96447 0.146595C6.7692 0.341857 6.7692 0.65844 6.96447 0.853702L9.79289 3.68213L6.96447 6.51056C6.7692 6.70582 6.7692 7.0224 6.96447 7.21766C7.15973 7.41293 7.47631 7.41293 7.67157 7.21766L10.8536 4.03568ZM0.5 3.68213V4.18213H10.5V3.68213V3.18213H0.5V3.68213Z"
                    fill="#71717A"
                  />
                </svg>
        </BackChat>

    </MobileLayout>
  );
}

export default ChatPage;

const ChatWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 699px;
  padding: 0 20px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin: 0 auto;
  padding-top : 15px;
`;

const BackChat = styled.div`
    color: var(--Neutral-N40, #71717a);
  text-align: center;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 300;
  line-height: 140%;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  margin-right: 20px;
  gap: 8px;

  cursor: pointer;
`;