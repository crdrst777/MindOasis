import { useState } from "react";
import { Link } from "react-router-dom";
import { styled } from "styled-components";

interface NavProps {
  userObj: any | null;
}

const Nav = ({ userObj }: NavProps) => {
  return (
    <Container>
      <MenuContainer>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/content">Content</Link>
        </li>
        <li>
          <Link to="/mypage">
            {/* <span>{userObj.displayName}'s My Page</span> */}
            <AvatarContainer>
              {userObj.photoURL ? (
                <img src={userObj.photoURL} alt="profile photo" />
              ) : (
                <img src="null" alt="profile photo" />
              )}
            </AvatarContainer>
          </Link>
        </li>
      </MenuContainer>
    </Container>
  );
};

export default Nav;

const Container = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 4rem;
  padding: 0 6rem 0 6rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.borderGray};
`;

const MenuContainer = styled.ul`
  display: flex;
  justify-content: space-between;
  width: 25rem;
  height: 100%;
  /* background-color: red; */

  li {
    display: flex;
    align-items: center;
    font-weight: 400;
    background-color: blue;
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
