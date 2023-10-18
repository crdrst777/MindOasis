import { Link } from "react-router-dom";
import { styled } from "styled-components";

const linkInfo = [
  { title: "마인드오아시스 소개", link: "" },
  { title: "이용약관", link: "" },
  { title: "개인정보처리방침", link: "" },
  { title: "1:1 문의", link: "" },
];

const Footer = () => {
  return (
    <Container>
      <Menu>
        {linkInfo.map((item, idx) => (
          <Item key={idx}>
            <Link to={`${item.link}`}>{`${item.title}`}</Link>
          </Item>
        ))}
      </Menu>
      <Info>
        <InfoBlock>
          <span>Contact </span>
          <span>Mindoasis.official@gmail.com</span>
        </InfoBlock>

        <span>Copyright Mindoasis. All rights reserved</span>
      </Info>
    </Container>
  );
};

export default Footer;

const Container = styled.footer`
  border-top: ${(props) => props.theme.borders.lightGray};
  padding: 0 2.5rem;
  margin-bottom: 0.3rem;
`;

const Menu = styled.ul`
  display: flex;
  padding: 1.6rem 0 1.4rem 0;
`;

const Item = styled.li`
  color: ${(props) => props.theme.colors.darkGray};
  font-size: 0.98rem;
  font-weight: 300;
  cursor: pointer;
  margin-right: 1.5rem;
  padding-right: 1.5rem;

  &:hover {
    text-decoration: 0.07rem underline ${(props) => props.theme.colors.gray};
    text-underline-offset: 0.2rem;
  }
`;

const Info = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-top: ${(props) => props.theme.borders.lightGray};
  padding: 1.5rem 0;

  span {
    color: ${(props) => props.theme.colors.gray};
    font-size: 0.9rem;
    font-weight: 300;
  }
`;

const InfoBlock = styled.div`
  :first-child {
    color: #797979;
    font-weight: 500;
  }
`;
