import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../fbase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { styled } from "styled-components";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Validations from "../../components/Auth/Validation";
import SocialLogin from "../../components/Auth/SocialLogin";
import { ReactComponent as ArrowIcon } from "../../assets/icon/arrow-icon.svg";
import { loginSchema } from "../../components/Auth/ValidationSchemas";

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (inputData: any) => {
    try {
      const data = await signInWithEmailAndPassword(
        authService,
        inputData.email,
        inputData.password
      );
      navigate("/content");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        alert("유효하지 않은 이메일입니다. 다시 입력해주세요.");
      } else if (error.code === "auth/wrong-password") {
        alert("유효하지 않은 비밀번호입니다. 다시 입력해주세요.");
      } else if (error.code === "auth/too-many-requests") {
        alert(
          "연속된 로그인 요청이 여러 번 감지되어 로그인 요청이 금지되었습니다.\n잠시 후 다시 시도해 주세요."
        );
      } else {
        alert(error.code);
      }
    }
  };

  const onError = (error: any) => {};

  return (
    <Container>
      <MainContainer>
        <LoginTitle>로그인</LoginTitle>
        <LoginContainer>
          <LoginForm onSubmit={handleSubmit(onSubmit, onError)}>
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
              <SubmitBtn type="submit">로그인</SubmitBtn>
            </InputBlock>
          </LoginForm>

          <SocialLoginWrapper>
            <SocialLogin />
          </SocialLoginWrapper>

          <SignUpBlock>
            <p>아직 회원이 아니신가요?</p>
            <Link to="/signup">
              가입하기
              <ArrowIcon />
            </Link>

            {/* <SignUpBtn onClick={goToSignUp}>가입하기</SignUpBtn> */}
          </SignUpBlock>
        </LoginContainer>
      </MainContainer>
    </Container>
  );
};

export default Login;

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
  margin: 4rem auto;
`;

const LoginTitle = styled.h2`
  font-size: 1.625rem;
  font-weight: 500;
  margin-bottom: 3.5rem;
`;

const LoginContainer = styled.div`
  width: 100%;
`;

const LoginForm = styled.form``;

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

const PasswordInput = styled(EmailInput)``;

const SubmitBtn = styled.button`
  height: 3rem;
  color: ${(props) => props.theme.colors.black};
  background-color: ${(props) => props.theme.colors.yellow};
  border-radius: 6px;
  padding: 0.18rem 0 0 0;
  font-size: 0.95rem;
  font-weight: 600;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #ffda45;
  }
`;

const SocialLoginWrapper = styled.div`
  margin-bottom: 3rem;
`;

const SignUpBlock = styled.div`
  display: flex;
  justify-content: center;

  p {
    font-size: 0.93rem;
  }

  a {
    margin-left: 1rem;
    font-size: 0.93rem;
    font-weight: 500;
    display: flex;
  }

  svg {
    margin-left: 0.1rem;
    width: 1.05rem;
    height: 1.05rem;
  }
`;
