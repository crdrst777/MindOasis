import { NavLink } from "react-router-dom";
import { styled } from "styled-components";
import avatar from "../../assets/img/avatar-icon.png";

const Sidebar = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  console.log(userInfo);

  return (
    <Container>
      <SidebarHeader>
        <AvatarContainer>
          {userInfo.photoURL ? (
            <img src={userInfo.photoURL} alt="profile photo" />
          ) : (
            <BasicAvatarIcon />
          )}
        </AvatarContainer>

        <Nickname>{userInfo.displayName}</Nickname>
        <Email>{userInfo.email}</Email>
      </SidebarHeader>
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 15rem;
  height: 32rem;
  border: 1px solid ${(props) => props.theme.colors.borderGray};
  border-radius: 0.4rem;
  padding: 2.7rem 2.6rem;
  background-color: ${(props) => props.theme.colors.white};
`;

const SidebarHeader = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background-color: azure; */
`;

const AvatarContainer = styled.div`
  width: 6rem;
  height: 6rem;
  border-radius: 50%;

  img {
    width: 6rem;
    height: 6rem;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const BasicAvatarIcon = styled.img.attrs({
  src: avatar,
})`
  width: 6rem;
  height: 6rem;
  object-fit: cover;
  border-radius: 50%;
`;

const Nickname = styled.div`
  margin-top: 1.7rem;
  font-size: 1.4rem;
  font-weight: 500;
  /* background-color: pink; */
`;
const Email = styled.div`
  margin-top: 1.3rem;
  font-size: 1.1rem;
  color: ${(props) => props.theme.colors.gray};
  /* background-color: orange; */
`;

const SidebarMenu = styled.ul`
  height: 11rem;
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  li {
    border-left: 3.5px solid ${(props) => props.theme.colors.white};
    cursor: pointer;
    transition: border-left 0.2s ease;
    &:hover {
      border-left: 4px solid ${(props) => props.theme.colors.yellow};
    }
  }

  a {
    display: flex;
    align-items: center;
    float: right;
    height: 2rem;
    font-size: 1.1rem;
    font-weight: 400;
    color: ${(props) => props.theme.colors.darkGray};
  }
`;

const StyledLink = styled(NavLink)``;
