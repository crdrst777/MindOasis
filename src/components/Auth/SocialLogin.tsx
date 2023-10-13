import React from "react";
import { authService, dbService, storageService } from "../../fbase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { styled } from "styled-components";
import { useNavigate } from "react-router";
import { UserDocType } from "../../types/types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, uploadString } from "firebase/storage";

const SocialLogin = () => {
  const navigate = useNavigate();

  const onSocialClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name;
    let provider;
    try {
      if (name === "google") {
        provider = new GoogleAuthProvider();
      } else if (name === "github") {
        provider = new GithubAuthProvider();
      }
      if (provider) {
        const response = await signInWithPopup(authService, provider);
        console.log("signInWithPopupData", response.user);
        if (response.user) {
          const user = response.user;
          const userData: UserDocType = {
            uid: user.uid,
            email: user.email ?? "",
            displayName: user.displayName ?? "",
            photoURL: user.photoURL ?? "",
            // photoURL: null,
            myLikes: [],
          };

          console.log("user", user);

          const userDocRef = doc(dbService, "users", `${userData.uid}`);
          const userDocSnap = await getDoc(userDocRef);
          if (!userDocSnap.exists()) {
            // doc에 등록되있지 않은 새로운 유저라면
            await setDoc(doc(dbService, "users", `${user.uid}`), userData);
            console.log("등록", user.uid);
            console.log("등록", user.photoURL);

            // const googlePhotoRef = ref(storageService, `${user.photoURL}`); // 파일 경로 참조 생성
            // console.log("googlePhotoRef", googlePhotoRef);
            // const test = user.photoURL;
            // await uploadString(googlePhotoRef, test, "data_url");
          }
        }

        // navigate(`/`);
      }
    } catch (error: any) {
      console.log(error.code);
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
  border-radius: 6px;
  font-size: 0.92rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #5a5a5a;
  }
`;
