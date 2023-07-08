import { useState } from "react";
import { Link } from "react-router-dom";
import { styled } from "styled-components";

interface NavProps {
  userObj: any | null;
}

const Nav = ({ userObj }: NavProps) => {
  // const [profilePhoto, setProfilePhoto] = useState<any>("");

  return (
    <Container>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/content">Content</Link>
        </li>
        <li>
          <Link to="/mypage">
            {userObj.displayName}'s My Page
            <AvatarContainer>
              {userObj.photoURL ? (
                <img src={userObj.photoURL} alt="profile photo" />
              ) : (
                <img src="null" alt="profile photo" />
              )}
            </AvatarContainer>
          </Link>
        </li>
      </ul>
      <Space />
    </Container>
  );
};

export default Nav;

const Container = styled.nav``;

const AvatarContainer = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background-color: orange;

  img {
    width: 5rem;
    height: 5rem;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const Space = styled.div`
  height: 5rem;
`;
