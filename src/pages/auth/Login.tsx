import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../fbase";
import { signInWithEmailAndPassword } from "firebase/auth";
import SocialLogin from "../../components/Auth/SocialLogin/SocialLogin";

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
      navigate("/content");
    } catch (error: any) {
      window.confirm(error.code);
    }
  };

  const goToSignUp = () => {
    navigate("/signup");
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
      <SocialLogin />
      <button onClick={goToSignUp}>회원가입</button>
    </>
  );
};

export default Login;
