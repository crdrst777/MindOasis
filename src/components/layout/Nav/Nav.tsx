import { useState } from "react";
import { Link } from "react-router-dom";
import { styled } from "styled-components";

interface NavProps {
  userObj: any | null;
}

const Nav = ({ userObj }: NavProps) => {
  return (
    <Container>
      <NavContent>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/content">Content</Link>
        </li>
        <li>
          <Link to="/mypage">
            <span>{userObj.displayName}'s My Page</span>
          </Link>
          <AvatarContainer>
            {userObj.photoURL ? (
              <img src={userObj.photoURL} alt="profile photo" />
            ) : (
              <img src="null" alt="profile photo" />
            )}
          </AvatarContainer>
        </li>
      </NavContent>
    </Container>
  );
};

export default Nav;

const Container = styled.nav`
  margin-bottom: 5rem;
  display: flex;
  align-items: center;
  justify-content: end;
  width: 100%;
  height: 4rem;
  padding-right: 6rem;
  border-bottom: ${(props) => props.theme.borders.gray};
`;

const NavContent = styled.ul`
  display: flex;
  justify-content: space-between;
  width: 30rem;
  height: 100%;
  /* background-color: red; */

  li {
    display: flex;
    align-items: center;
    /* background-color: blue; */
  }
`;

const AvatarContainer = styled.span`
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 50%;
  margin-left: 1rem;
  background-color: orange;

  img {
    width: 2.8rem;
    height: 2.8rem;
    object-fit: cover;
    border-radius: 50%;
  }
`;
