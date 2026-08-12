import * as S from "./Layout.styled";
import MobileLayout from "../MobileLayout/MobileLayout";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <MobileLayout>
      <S.Content>
        <Outlet />
      </S.Content>

      <S.Chat>
        어쩌고 저쩌고
      </S.Chat>

      <S.Line
        width="5"
        height="50"
        viewBox="0 0 5 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="2.5"
          y1="2.5"
          x2="2.5"
          y2="47.5"
          stroke="#D1CCC7"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </S.Line>

      <S.GoChat>
        채팅으로 대화하기

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
      </S.GoChat>
    </MobileLayout>
  );
}

export default Layout;