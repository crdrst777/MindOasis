import { Link, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { ReactComponent as BasicAvatarIcon } from "../../assets/icon/avatar-icon.svg";
import { ReactComponent as SearchIcon } from "../../assets/icon/search-icon.svg";
import NavDropdown from "../UI/Dropdown/NavDropdown";

const Nav = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const goToMain = () => {
    navigate("/");
    window.location.reload();
  };

  const goToLogin = () => {
    if (!userInfo) {
      alert("로그인을 해주세요");
      navigate("/login");
    }
  };

  return (
    <Container>
      <Logo onClick={goToMain}>Mind Oasis</Logo>

      <NavList>
        <NavItem>
          <Link to="/search">
            <SearchWrapper>
              <SearchIcon />
            </SearchWrapper>
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/">목록</Link>
        </NavItem>
        <NavItem onClick={goToLogin}>
          <Link to="/uploadpost">새 글 쓰기</Link>
        </NavItem>

        {userInfo ? (
          <>
            <AvatarItem>
              <Link to="/mypage/updateprofile">
                <AvatarWrapper>
                  {userInfo.photoURL ? (
                    <img src={userInfo.photoURL} alt="profile photo" />
                  ) : (
                    <BasicAvatarIconWrapper>
                      <BasicAvatarIcon />
                    </BasicAvatarIconWrapper>
                  )}
                </AvatarWrapper>
              </Link>
            </AvatarItem>

            <NavDropdownWrapper>
              <NavDropdown />
            </NavDropdownWrapper>
          </>
        ) : (
          <NavItem>
            <Link to="/login">로그인</Link>
          </NavItem>
        )}
      </NavList>
    </Container>
  );
};

export default Nav;

const Container = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: auto;
  height: 4.5rem;
  padding: 0 6rem;
  border-bottom: ${(props) => props.theme.borders.lightGray};
`;

const Logo = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
`;

const SearchWrapper = styled.div`
  width: 1.7rem;
  padding-top: 0.3rem;

  svg {
    width: 1.7rem;
    stroke: ${(props) => props.theme.colors.black};

    &:hover {
      stroke: ${(props) => props.theme.colors.yellow};
    }
  }
`;

const NavList = styled.ul`
  display: flex;
  justify-content: space-between;
  height: inherit;
`;

const NavItem = styled.li`
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.black};
  margin-left: 2.5rem;
  cursor: pointer;
`;

const NavDropdownWrapper = styled.div`
  display: none;
  position: fixed;
  left: calc(100% - 17.5rem);
  bottom: calc(100% - 19.2rem);
  z-index: 1;

  // 이걸 해줘야 드롭다운박스로 내려오는 동안 박스가 안사라짐.
  &:hover {
    display: block;
  }
`;

const AvatarItem = styled.li`
  display: flex;
  align-items: center;
  margin-left: 2.5rem;

  &:hover + ${NavDropdownWrapper} {
    display: block;
  }
`;

const AvatarWrapper = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;

  img {
    width: 2.5rem;
    height: 2.5rem;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const BasicAvatarIconWrapper = styled.div`
  svg {
    width: 2.5rem;
    height: 2.5rem;
    object-fit: cover;
    border-radius: 50%;
  }
`;
