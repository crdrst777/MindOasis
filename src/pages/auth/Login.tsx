import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../fbase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  console.log(email);

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await signInWithEmailAndPassword(
        authService,
        email,
        password
      );
      console.log(data);
      console.log(data.user.email);
    } catch (error) {
      console.log("error", error);
      // setError(error.message);
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
      <div>
        <button>Continue with Google</button>
        <button onClick={goToSignUp}>회원가입</button>
      </div>
    </>
  );
};

export default Login;
