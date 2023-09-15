import React, { useState } from "react";
import { authService, dbService } from "../../fbase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { UserDocType } from "../../types/types";
import { styled } from "styled-components";
import SocialLogin from "../../components/Auth/SocialLogin/SocialLogin";

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    nickname: "",
    password: "",
  });

  // const [email, setEmail] = useState("");
  // const [nickname, setNickname] = useState("");
  // const [password, setPassword] = useState("");
  // // 오류 메세지 상태 저장
  // const [emailMessage, setEmailMessage] = useState("");
  // const [nicknameMessage, setNicknameMassage] = useState("");
  // const [passwordMessage, setPasswordMessage] = useState("");
  // // 유효성 검사
  // const [isemail, setIsEmail] = useState(false);
  // const [isnickname, setIsNickname] = useState(false);
  // const [ispassword, setIsPassword] = useState(false);

  // const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setEmail(e.currentTarget.value);
  // };

  // const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const currentValue = e.currentTarget.value;
  //   setNickname(currentValue);
  //   // const idRegExp = /^[a-zA-z0-9]{4,12}$/;

  //   if (currentValue.length > 1 || currentValue.length < 11) {
  //     setNicknameMassage("닉네임은 2글자 이상 10글자 이하로 입력해주세요.");
  //     setIsNickname(false);
  //   } else {
  //     setNicknameMassage("사용 가능한 닉네임 입니다.");
  //     setIsNickname(true);
  //   }
  // };

  // const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setPassword(e.currentTarget.value);
  // };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await createUserWithEmailAndPassword(
        authService,
        form.email,
        form.password
      );
      const userData: UserDocType = {
        email: form.email,
        // displayName: data.user.email.split("@")[0],
        displayName: form.nickname,
        uid: data.user.uid,
        photoURL: data.user.photoURL,
        myLikes: [],
      };
      // `${data.user.uid}` -> documentId 값이 된다. documentId를 직접 지정하는게 가능.
      await setDoc(doc(dbService, "users", `${data.user.uid}`), userData);

      alert("회원가입 완료");
      navigate(`/`);
    } catch (error: any) {
      window.confirm(error.code);
    }
  };

  console.log("form.nickname", form.nickname);

  return (
    <Container>
      <MainContainer>
        <SignUpTitle>회원가입</SignUpTitle>
        <SignUpContainer>
          <SignUpForm onSubmit={onSubmit}>
            <InputBlock>
              <InputLabel>이메일</InputLabel>
              <EmailInput
                type="email"
                value={form.email}
                placeholder="Email"
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, email: e.currentTarget.value })
                }
              />
              <EmailGuideArea></EmailGuideArea>
            </InputBlock>

            <InputBlock>
              <InputLabel>닉네임</InputLabel>
              <NicknameInput
                type="text"
                value={form.nickname}
                placeholder="text"
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, nickname: e.currentTarget.value })
                }
              />
              {/* <NicknameGuideArea>{nicknameMessage}</NicknameGuideArea> */}
            </InputBlock>

            <InputBlock>
              <InputLabel>비밀번호</InputLabel>
              <PasswordInput
                type="password"
                value={form.password}
                placeholder="Password"
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, password: e.currentTarget.value })
                }
              />
              <PasswordGuideArea></PasswordGuideArea>
            </InputBlock>

            <InputBlock>
              <SubmitBtn>가입하기</SubmitBtn>
            </InputBlock>
          </SignUpForm>

          <SocialLogin />
        </SignUpContainer>
      </MainContainer>
    </Container>
  );
};

export default SignUp;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  /* margin-bottom: 1.3rem; */
`;

const MainContainer = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin: 4rem auto;
  width: 20rem;
`;

const SignUpTitle = styled.h2`
  font-size: 1.625rem;
  font-weight: 400;
  margin-bottom: 4rem;
`;

const SignUpContainer = styled.div`
  width: 100%;
`;

const SignUpForm = styled.form``;

const InputBlock = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const InputLabel = styled.label`
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 0.315rem;
  color: ${(props) => props.theme.colors.darkGray};
`;

const EmailInput = styled.input`
  height: 3rem;
  font-size: 0.97rem;
  color: ${(props) => props.theme.colors.moreDarkGray};
  padding: 0 0.8rem;
  border-radius: 5px;
  border: ${(props) => props.theme.borders.lightGray};
  &:hover {
    outline: 1px solid #c9c9c9;
  }
  &:focus {
    outline: 1.8px solid ${(props) => props.theme.colors.yellow};
  }
`;

const NicknameInput = styled(EmailInput)``;

const PasswordInput = styled(EmailInput)``;

const SubmitBtn = styled.button``;

const EmailGuideArea = styled.p``;

const NicknameGuideArea = styled(EmailGuideArea)``;

const PasswordGuideArea = styled(EmailGuideArea)``;
