import { useState } from "react";
import { Link } from "react-router-dom";
import { styled } from "styled-components";

interface NavProps {}

const Nav = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <NavContainer>
      <Container>
        <NavbarLogo>
          <Link to="/">
            {/* <img></img> */}
            Mind Oasis
          </Link>
        </NavbarLogo>
        <NavbarMenu>
          <li>
            <Link to="/content">목록</Link>
          </li>
          <li>
            <Link to="/postupload">새 글 쓰기</Link>
          </li>
          <li>
            <Link to="/mypage/updateprofile">
              {/* <span>{userObj.displayName}'s My Page</span> */}
              <AvatarContainer>
                {userInfo.photoURL ? (
                  <img src={userInfo.photoURL} alt="profile photo" />
                ) : (
                  <img src="null" alt="profile photo" />
                )}
              </AvatarContainer>
            </Link>
          </li>
        </NavbarMenu>
      </Container>
    </NavContainer>
  );
};

export default Nav;

const NavContainer = styled.div`
  /* width: 100vw; */
`;

const Container = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: auto;
  height: 4rem;
  padding: 0 6rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.borderGray};
`;

const NavbarLogo = styled.div`
  font-size: ${(props) => props.theme.fontSizes.xl};
  font-weight: 600;
`;

const NavbarMenu = styled.ul`
  display: flex;
  justify-content: space-between;
  height: inherit;
  /* background-color: red; */

  li {
    display: flex;
    align-items: center;
    font-size: 1rem;
    font-weight: 500;
    color: ${(props) => props.theme.colors.darkGray};
    padding-left: 2rem;
    /* background-color: blue; */
  }
`;

const AvatarContainer = styled.div`
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 50%;
  background-color: orange;

  img {
    width: 2.8rem;
    height: 2.8rem;
    object-fit: cover;
    border-radius: 50%;
  }
`;
