import { authService, dbService } from "../../fbase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { UserDocType } from "../../types/types";
import { styled } from "styled-components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SocialLogin from "../../components/Auth/SocialLogin";
import Validations from "../../components/Auth/Validation";
import { signUpSchema } from "../../components/Auth/ValidationSchemas";

const SignUp = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
    mode: "onChange",
  });

  const onSubmit = async (inputData: any) => {
    try {
      const data = await createUserWithEmailAndPassword(
        authService,
        inputData.email,
        inputData.password
      );

      const userData: UserDocType = {
        email: inputData.email,
        displayName: "",
        uid: data.user.uid,
        photoURL: data.user.photoURL,
        myLikes: [],
      };

      // `${data.user.uid}` -> documentId 값이 된다. documentId를 직접 지정하는게 가능.
      await setDoc(doc(dbService, "users", `${data.user.uid}`), userData);
      alert("회원가입이 완료되었습니다!");
      navigate(`/`);
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        alert("이미 사용 중인 이메일입니다.");
      } else {
        alert(error.code);
      }
    }
  };

  const onError = (error: any) => {};

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
`;

const MainContainer = styled.section`
  width: 20rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin: 7rem auto 14.1rem auto;
`;

const SignUpTitle = styled.h2`
  font-size: 1.625rem;
  font-weight: 500;
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
  border-radius: 0.315rem;
  border: ${(props) => props.theme.borders.lightGray};

  &::placeholder {
    color: ${(props) => props.theme.colors.gray1};
    font-size: 0.9rem;
  }
  &:hover {
    outline: 1px solid #d3d3d3;
  }
  &:focus {
    border: 1px solid ${(props) => props.theme.colors.yellow};
    outline: 1px solid ${(props) => props.theme.colors.yellow};
  }
`;

const PasswordInput = styled(EmailInput)``;

const SubmitBtn = styled.button`
  height: 3rem;
  color: ${(props) => props.theme.colors.black};
  background-color: ${(props) => props.theme.colors.yellow};
  border-radius: 0.315rem;
  padding: 0.18rem 0 0 0;
  font-size: 0.95rem;
  font-weight: 600;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #ffda45;
  }
`;
