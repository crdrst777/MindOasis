import React from "react";
import { authService } from "../../../fbase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { styled } from "styled-components";

const SocialLogin = () => {
  const onSocialClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    if (provider) {
      const data = await signInWithPopup(authService, provider);
      console.log("signInWithPopupData", data);
    }
  };

  return (
    <Btn name="google" onClick={onSocialClick}>
      구글 로그인
    </Btn>
  );
};

export default SocialLogin;

const Btn = styled.button`
  width: 20rem;
  height: 3rem;
  color: ${(props) => props.theme.colors.white};
  background-color: ${(props) => props.theme.colors.darkGray};
  border-radius: 9px;
  font-size: 0.92rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #5a5a5a;
  }
`;
