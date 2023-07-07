import React, { useState } from "react";
import { authService } from "../../fbase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState("");

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await createUserWithEmailAndPassword(
        authService,
        email,
        password
      );
      console.log("data", data);
      console.log(data.user.email);
    } catch (error: any) {
      // } catch (error: FirebaseApp.FirebaseError) {
      window.confirm(error.code);
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
        <input type="submit" value="회원가입" />
      </form>
    </>
  );
};

export default SignUp;
