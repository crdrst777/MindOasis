import React, { useState } from "react";
import { authService, dbService } from "../../fbase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { UserDocType } from "../../types/types";
import { styled } from "styled-components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SocialLogin from "../../components/Auth/SocialLogin/SocialLogin";
import Validations from "../../components/Auth/Validation";

const schema = yup.object().shape({
  email: yup
    .string()
    // .min(2, "최소 2글자 이상 입력해야 합니다.")
    // .max(16, "최대 16글자 까지 입력할 수 있습니다.")
    .matches(/^[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+$/, "영문으로만 입력할 수 있습니다.")
    .matches(
      /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      "이메일 주소에 '@'를 포함해 주세요."
    )
    .required("이메일을 입력해주세요."),
  nickname: yup
    .string()
    .min(2, "최소 2글자 이상 입력해야 합니다.")
    .max(16, "최대 16글자 까지 입력할 수 있습니다.")
    .matches(/^[^\s]+$/, "띄어쓰기를 사용할 수 없습니다.")
    .required("닉네임을 입력해주세요."),
  password: yup
    .string()
    .min(6, "최소 6글자 이상 입력해야 합니다.")
    .max(16, "최대 16글자 까지 입력할 수 있습니다.")
    .matches(
      /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W))/,
      "영문, 숫자, 특수문자가 포함되어야 합니다."
    )
    .matches(/^[^\s]+$/, "띄어쓰기를 사용할 수 없습니다.")
    .required("비밀번호를 입력해주세요."),
});

const SignUp = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (inputData: any) => {
    try {
      const data = await createUserWithEmailAndPassword(
        authService,
        inputData.email,
        inputData.password
      );

      console.log("inputData", inputData);
      console.log("data", data);

      const userData: UserDocType = {
        email: inputData.email,
        displayName: inputData.nickname,
        uid: data.user.uid,
        photoURL: data.user.photoURL,
        myLikes: [],
      };

      console.log("userData", userData);

      // `${data.user.uid}` -> documentId 값이 된다. documentId를 직접 지정하는게 가능.
      await setDoc(doc(dbService, "users", `${data.user.uid}`), userData);

      alert("회원가입이 완료되었습니다!");
      navigate(`/`);
    } catch (error: any) {
      window.confirm(error.code);
    }
  };

  const onError = (error: any) => {
    // console.log(error);
  };

  return (
    <Container>
      <MainContainer>
        <SignUpTitle>회원가입</SignUpTitle>
        <SignUpContainer>
          <SignUpForm onSubmit={handleSubmit(onSubmit, onError)}>
            <InputBlock>
              <InputLabel>이메일</InputLabel>
              <EmailInput
                type="email"
                placeholder="example@mindoasis.com"
                {...register("email")}
              />
              {errors.email && <Validations value={errors.email.message} />}
              {/* <EmailGuideArea></EmailGuideArea> */}
            </InputBlock>

            <InputBlock>
              <InputLabel>닉네임</InputLabel>
              <NicknameInput
                type="text"
                placeholder="닉네임"
                {...register("nickname")}
              />
              {errors.nickname && (
                <Validations value={errors.nickname.message} />
              )}
              {/* <NicknameGuideArea></NicknameGuideArea> */}
            </InputBlock>

            <InputBlock>
              <InputLabel>비밀번호</InputLabel>
              <PasswordInput
                type="password"
                placeholder="영문, 숫자, 특수문자 포함 6자 이상"
                {...register("password")}
              />
              {errors.password && (
                <Validations value={errors.password.message} />
              )}
              {/* <PasswordGuideArea></PasswordGuideArea> */}
            </InputBlock>

            <InputBlock>
              <SubmitBtn type="submit">가입하기</SubmitBtn>
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
  width: 20rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin: 4rem auto;
`;

const SignUpTitle = styled.h2`
  font-size: 1.625rem;
  font-weight: 400;
  margin-bottom: 3.5rem;
`;

const SignUpContainer = styled.div`
  width: 100%;
`;

const SignUpForm = styled.form``;

const InputBlock = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 1.2rem;
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

  &::placeholder {
    color: ${(props) => props.theme.colors.gray1};
    font-size: 0.9rem;
  }

  &:hover {
    outline: 1px solid #c9c9c9;
  }
  &:focus {
    outline: 1.8px solid ${(props) => props.theme.colors.yellow};
  }
`;

const NicknameInput = styled(EmailInput)``;

const PasswordInput = styled(EmailInput)``;

const SubmitBtn = styled.button`
  height: 3rem;
  color: ${(props) => props.theme.colors.black};
  background-color: ${(props) => props.theme.colors.yellow};
  border-radius: 9px;
  padding: 0 1.25rem;
  font-size: 0.92rem;
  font-weight: 600;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #ffda45;
  }
`;

const EmailGuideArea = styled.p``;

const NicknameGuideArea = styled(EmailGuideArea)``;

const PasswordGuideArea = styled(EmailGuideArea)``;
