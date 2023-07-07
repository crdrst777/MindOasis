import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../fbase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await signInWithEmailAndPassword(
        authService,
        email,
        password
      );
      console.log(data.user.email);
    } catch (error: any) {
      window.confirm(error.code);
    }
  };

  const goToSignUp = () => {
    navigate("/signup");
  };

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
    <>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          value={email}
          placeholder="Email"
          required
          onChange={onChangeEmail}
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          required
          onChange={onChangePassword}
        />
        <input type="submit" value="로그인" />
      </form>
      <div>
        <button name="google" onClick={onSocialClick}>
          Continue with Google
        </button>
        <button name="github" onClick={onSocialClick}>
          Continue with Github
        </button>
      </div>
      <button onClick={goToSignUp}>회원가입</button>
    </>
  );
};

export default Login;
