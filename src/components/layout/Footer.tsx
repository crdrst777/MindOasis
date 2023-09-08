import { styled } from "styled-components";

const Footer = () => {
  return (
    <Container>
      <div></div>
    </Container>
  );
};

export default Footer;

const Container = styled.footer`
  border-top: 1px solid ${(props) => props.theme.colors.borderGray};
  height: 7rem;
  /* background-color: red; */
`;
