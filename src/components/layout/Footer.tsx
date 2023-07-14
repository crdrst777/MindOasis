import React from "react";
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
  border-bottom: 1px solid ${(props) => props.theme.colors.borderGray};
  padding: 5rem;
`;
