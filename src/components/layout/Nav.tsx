import { Link, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import avatar from "../../assets/img/avatar-icon.png";
import { useState } from "react";
// import search from "../../assets/img/search-icon.png";
import { ReactComponent as SearchIcon } from "../../assets/icon/search-icon.svg";

const Nav = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const goToLogin = () => {
    if (!userInfo) {
      alert("로그인을 해주세요");
      navigate("/login");
      // refreshUser();
      // window.location.reload();
    }
  };

  return (
    <Container>
      <Logo>
        <Link to="/">
          {/* <img></img> */}
          Mind Oasis
        </Link>
      </Logo>

      {/* <SearchBar>
        <SearchInput
          value={keyword}
          onChange={onChange}
          placeholder="지역명을 입력하세요."
        />
        <Btn onClick={onSubmit}>검색</Btn>
      </SearchBar> */}

      <Menu>
        <li>
          <Link to="/search">
            <SearchWrapper>
              <SearchIcon />
            </SearchWrapper>
          </Link>
        </li>
        <li>
          <Link to="/content">목록</Link>
        </li>
        <li onClick={goToLogin}>
          <Link to="/uploadpost">새 글 쓰기</Link>
        </li>

        {userInfo ? (
          <li>
            <Link to="/mypage/updateprofile">
              <AvatarWrapper>
                {userInfo.photoURL ? (
                  <img src={userInfo.photoURL} alt="profile" />
                ) : (
                  <BasicAvatarIcon />
                )}
              </AvatarWrapper>
            </Link>
          </li>
        ) : (
          <li>
            <Link to="/login">로그인</Link>
          </li>
        )}
      </Menu>
    </Container>
  );
};

export default Nav;

const Container = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: auto;
  height: 3.8rem;
  padding: 0 6rem;
  border-bottom: ${(props) => props.theme.borders.lightGray};
`;

const Logo = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
`;

const SearchWrapper = styled.div`
  width: 1.7rem;
  padding-top: 0.3rem;

  svg {
    width: 1.7rem;
    /* background-color: red; */
    stroke: ${(props) => props.theme.colors.black};

    &:hover {
      stroke: ${(props) => props.theme.colors.yellow};
    }
  }
`;

// const SearchIcon = styled.img.attrs({
//   src: search,
// })`
//   width: 1.3rem;
//   padding-top: 0.3rem;
//   top: 1rem;
//   left: 1rem;
//   color: ${(props) => props.theme.colors.yellow};

//   &:hover {
//     color: ${(props) => props.theme.colors.lightGray};
//   }
// `;

// const SearchBar = styled.div`
//   width: 20rem;
//   height: 100%;
//   /* background-color: aquamarine; */
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   /* margin-right: 25rem; */
// `;

// const SearchInput = styled.input`
//   width: 18rem;
//   height: 2.7rem;
//   font-size: 0.9rem;
//   font-weight: 0.8rem;
//   color: ${(props) => props.theme.colors.moreDarkGray};
//   padding: 0 1.2rem;
//   border-radius: 5px;
//   border: none;
//   background-color: ${(props) => props.theme.colors.lightGray};

//   /* border: ${(props) => props.theme.borders.gray}; */
//   &:hover {
//     /* outline: 1px solid #c9c9c9; */
//   }
//   &:focus {
//     /* outline: 1.8px solid ${(props) => props.theme.colors.yellow}; */
//     outline: none;
//   }
// `;

// const Btn = styled.button`
//   cursor: pointer;
// `;

const Menu = styled.ul`
  display: flex;
  justify-content: space-between;
  height: inherit;

  li {
    display: flex;
    align-items: center;
    font-size: 1.03rem;
    font-weight: 500;
    color: ${(props) => props.theme.colors.black};
    margin-left: 2rem;
    cursor: pointer;
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

const BasicAvatarIcon = styled.img.attrs({
  src: avatar,
})`
  width: 2.5rem;
  height: 2.5rem;
  object-fit: cover;
  border-radius: 50%;
`;
