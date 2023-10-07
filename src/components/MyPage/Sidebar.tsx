import { NavLink, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { ReactComponent as BasicAvatarIcon } from "../../assets/icon/avatar-icon.svg";
import { authService } from "../../fbase";

interface Props {
  linkTitle: string;
}

const linkInfo = [
  { title: "회원정보 변경", link: "/mypage/updateprofile" },
  { title: "비밀번호 변경", link: "/mypage/updatepassword" },
  { title: "내 작성글", link: "/mypage/myposts" },
  { title: "내 관심글", link: "/mypage/mylikes" },
  // { title: "회원 탈퇴", link: "/mypage/deleteaccount" },
];

const Sidebar = ({ linkTitle }: Props) => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const onLogOutClick = async () => {
    await authService.signOut();
    navigate("/");
    window.location.reload();
  };

  return (
    <Container>
      <SidebarHeader>
        <AvatarContainer>
          {userInfo.photoURL ? (
            <img src={userInfo.photoURL} alt="profile photo" />
          ) : (
            <BasicAvatarIconWrapper>
              <BasicAvatarIcon />
            </BasicAvatarIconWrapper>
          )}
        </AvatarContainer>

        <Nickname>{userInfo.displayName}</Nickname>
        <Email>{userInfo.email}</Email>
      </SidebarHeader>
      <SidebarMenu>
        {linkInfo.map((item, idx) =>
          // 내가 클릭한 페이지에 따라 (활성화에 따라) css를 다르게 해준다.
          linkTitle === item.title ? (
            <ActivatedItem key={idx}>
              <StyledLink to={`${item.link}`}>{`${item.title}`}</StyledLink>
            </ActivatedItem>
          ) : (
            <Item key={idx}>
              <StyledLink to={`${item.link}`}>{`${item.title}`}</StyledLink>
            </Item>
          )
        )}

        <Item>
          <LogOutBtn onClick={onLogOutClick}>Log Out</LogOutBtn>
        </Item>
      </SidebarMenu>
    </Container>
  );
};

export default Sidebar;

const Container = styled.aside`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 14.5rem;
  height: 30rem;
  border: ${(props) => props.theme.borders.lightGray};
  border-radius: 1.4rem;
  padding: 2.3rem 2.4rem;
  background-color: ${(props) => props.theme.colors.white};
`;

const SidebarHeader = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 0.3rem;
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

const BasicAvatarIconWrapper = styled.div`
  svg {
    width: 6.3rem;
    height: 6.3rem;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const Nickname = styled.div`
  margin-top: 1.7rem;
  font-size: 1.15rem;
  font-weight: 600;
`;

const Email = styled.div`
  margin-top: 1rem;
  font-size: 1.05rem;
  color: ${(props) => props.theme.colors.gray};
`;

const SidebarMenu = styled.ul`
  height: 11rem;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const ActivatedItem = styled.li`
  border-left: 3.5px solid ${(props) => props.theme.colors.white};
  cursor: pointer;
  transition: border-left 0.2s ease;
  border-left: 4px solid ${(props) => props.theme.colors.yellow};

  &:hover {
    border-left: 4px solid ${(props) => props.theme.colors.yellow};
  }
`;

const Item = styled.li`
  border-left: 3.5px solid ${(props) => props.theme.colors.white};
  cursor: pointer;
  transition: border-left 0.2s ease;
  border-left: 4px solid ${(props) => props.theme.colors.white};

  &:hover {
    border-left: 4px solid ${(props) => props.theme.colors.yellow};
  }
`;

const StyledLink = styled(NavLink)`
  display: flex;
  align-items: center;
  float: right;
  height: 1.9rem;
  font-size: 1.03rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.darkGray};
`;

const LogOutBtn = styled.button``;
