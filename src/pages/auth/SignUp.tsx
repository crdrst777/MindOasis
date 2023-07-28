import React, { useState } from "react";
import { authService, dbService } from "../../fbase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const SignUp = () => {
  const navigate = useNavigate();
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
      const userData = {
        email: email,
        displayName: data.user.email.split("@")[0],
        uid: data.user.uid,
        photoURL: data.user.photoURL,
      };
      // `${data.user.uid}` -> documentId 값이 된다. documentId를 직접 지정하는게 가능.
      await setDoc(doc(dbService, "users", `${data.user.uid}`), userData);

      alert("회원가입 완료");
      navigate(`/`);
    } catch (error: any) {
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
