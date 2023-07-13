import { NavLink } from "react-router-dom";
import { styled } from "styled-components";

const Sidebar = () => {
  return (
    <Container>
      <SidebarHeader></SidebarHeader>
      <SidebarMenu>
        <li>
          <StyledLink to="/mypage/updateprofile">회원정보 변경</StyledLink>
        </li>
        <li>
          <StyledLink to="/mypage/updatepassword">비밀번호 변경</StyledLink>
        </li>
        <li>
          <StyledLink to="/mypage/myposts">내 작성글</StyledLink>
        </li>
        <li>
          <StyledLink to="/mypage/mylikes">내 관심글</StyledLink>
        </li>
      </SidebarMenu>
    </Container>
  );
};

export default Sidebar;

const Container = styled.aside`
  width: 280px;
  /* height: 100%; */
  border: 1px solid ${(props) => props.theme.colors.borderGray};
  border-radius: 0.4rem;
  padding: 3rem 2rem 3rem 2rem;
  background-color: ${(props) => props.theme.colors.white};
`;

const SidebarHeader = styled.header`
  height: 15rem;
  background-color: azure;
`;

const SidebarMenu = styled.ul`
  margin-top: 4rem;
  /* background-color: azure; */

  li {
    margin-top: 2rem;
    font-size: ${(props) => props.theme.fontSizes.lg};
    font-weight: 400;
  }
`;

const StyledLink = styled(NavLink)``;
