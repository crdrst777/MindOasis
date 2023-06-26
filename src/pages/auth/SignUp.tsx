import React, { useState } from "react";
import { authService } from "../../fbase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
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
      // } catch (error: firebaseApp.FirebaseError) {
      setError(error.code);
    }
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
        <input type="submit" value="회원가입" />
      </form>
      <div>
        <button name="google" onClick={onSocialClick}>
          Continue with Google
        </button>
        <button name="github" onClick={onSocialClick}>
          Continue with Github
        </button>
        {error}
      </div>
    </>
  );
};

export default SignUp;
