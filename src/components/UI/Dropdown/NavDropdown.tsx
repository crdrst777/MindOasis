import { Link, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { authService } from "../../../fbase";

const linkInfo = [
  { title: "회원정보 변경", link: "/mypage/updateprofile" },
  { title: "비밀번호 변경", link: "/mypage/updatepassword" },
  { title: "내 작성글", link: "/mypage/myposts" },
  { title: "내 관심글", link: "/mypage/mylikes" },
];

const NavDropdown = () => {
  const navigate = useNavigate();

  const onLogOutClick = async () => {
    await authService.signOut();
    navigate("/");
    window.location.reload();
  };

  return (
    <Container>
      <DropdownList>
        {linkInfo.map((item, idx) => (
          <Link to={`${item.link}`} key={idx}>
            <DropdownItem>{`${item.title}`}</DropdownItem>
          </Link>
        ))}
        <DropdownItem onClick={onLogOutClick}>로그아웃</DropdownItem>
      </DropdownList>
    </Container>
  );
};

export default NavDropdown;

const Container = styled.div`
  width: 12.5rem;
  border-radius: 0.9rem;
  background-color: ${(props) => props.theme.colors.white};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.182);
  /* inset: auto 0px 0px auto; */
`;

const DropdownList = styled.ul`
  width: 12.5rem;
  height: 100%;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const DropdownItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.7rem 1.75rem;
  font-size: 1.02rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.darkGray};

  cursor: pointer;
  transition: background-color 0.05s ease;
  &:hover {
    background-color: #f5f5f5;
  }
`;
