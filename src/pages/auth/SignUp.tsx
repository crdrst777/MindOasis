import React, { useState } from "react";
import { authService, dbService } from "../../fbase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";

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

  const uploadData = (data: any) => {
    const usersData = {
      email: email,
      displayName: data.email.split("@")[0],
      uid: data.uid,
      photoURL: data.photoURL,
    };
    addDoc(collection(dbService, "users"), usersData);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await createUserWithEmailAndPassword(
        authService,
        email,
        password
      );
      console.log(data.user.uid); // document id는 유저 uid로 하면 편리할듯
      console.log("data.user", data.user); // document id는 유저 uid로 하면 편리할듯

      await uploadData(data.user);

      alert("회원가입 완료");
      navigate(`/`);
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
