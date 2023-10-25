import { styled } from "styled-components";
import Sidebar from "../../components/MyPage/Sidebar";
import { authService } from "../../fbase";
import { updatePassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UpdatePasswordSchema } from "../../components/Auth/ValidationSchemas";
import Validations from "../../components/Auth/Validation";
import { useState } from "react";
import Reauthenticate from "../../components/Auth/Reauthenticate";
import { useNavigate } from "react-router";

const UpdatePasswordPage = () => {
  const navigate = useNavigate();
  const [isReauthenticated, setIsReauthenticated] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(UpdatePasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (inputData: any) => {
    const user = authService.currentUser;

    updatePassword(user, inputData.newPassword)
      .then(() => {
        alert("비밀번호가 변경되었습니다.");
        navigate("/mypage/updateprofile");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onError = (error: any) => {
    console.log(error);
  };

  return (
    <MyPageContainer>
      <Container>
        <Sidebar linkTitle={"비밀번호 변경"} />

        <MainContainer>
          {!isReauthenticated ? (
            <Reauthenticate
              inputLabel={"현재 비밀번호"}
              btnText={"확인"}
              setIsReauthenticated={setIsReauthenticated}
            />
          ) : (
            <UpdateForm onSubmit={handleSubmit(onSubmit, onError)}>
              <InputBlock>
                <InputLabel>새로운 비밀번호</InputLabel>
                <NewPasswordInput
                  type="password"
                  placeholder="영문, 숫자, 특수문자 포함 6자 이상"
                  {...register("newPassword")}
                />
                {errors.newPassword && (
                  <Validations value={errors.newPassword.message} />
                )}
              </InputBlock>
              <InputBlock>
                <InputLabel>비밀번호 확인</InputLabel>
                <ConfirmPasswordInput
                  type="password"
                  placeholder="비밀번호를 다시 입력해주세요."
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <Validations value={errors.confirmPassword.message} />
                )}
              </InputBlock>
              <BtnContainer>
                <SubmitBtn type="submit">저장하기</SubmitBtn>
              </BtnContainer>
            </UpdateForm>
          )}
        </MainContainer>
      </Container>
    </MyPageContainer>
  );
};

export default UpdatePasswordPage;

const MyPageContainer = styled.div`
  background-color: ${(props) => props.theme.colors.backgroundGray};
`;
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 57rem;
  margin: auto;
  padding: 4rem 0 7rem 0;
`;

const MainContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40.6rem;
  height: 36.7rem;
  padding: 3rem 3rem;
  border: ${(props) => props.theme.borders.lightGray};
  border-radius: 1.4rem;
  background-color: ${(props) => props.theme.colors.white};
`;

const UpdateForm = styled.form`
  width: 18rem;
`;

const InputBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
`;

const InputLabel = styled.label`
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 0.315rem;
  color: ${(props) => props.theme.colors.darkGray};
`;

const NewPasswordInput = styled.input`
  height: 3rem;
  font-size: 0.97rem;
  color: ${(props) => props.theme.colors.moreDarkGray};
  padding: 0 0.8rem;
  border-radius: 6px;
  border: ${(props) => props.theme.borders.lightGray};
  &::placeholder {
    color: ${(props) => props.theme.colors.gray1};
    font-size: 0.9rem;
  }
  &:hover {
    outline: 1px solid #d3d3d3;
  }
  &:focus {
    border: 1px solid ${(props) => props.theme.colors.darkYellow};
    outline: 1px solid ${(props) => props.theme.colors.darkYellow};
  }
`;

const ConfirmPasswordInput = styled.input`
  min-height: 3rem;
  font-size: 0.97rem;
  color: ${(props) => props.theme.colors.moreDarkGray};
  padding: 0 0.8rem;
  border-radius: 6px;
  border: ${(props) => props.theme.borders.lightGray};
  &::placeholder {
    color: ${(props) => props.theme.colors.gray1};
    font-size: 0.9rem;
  }
  &:hover {
    outline: 1px solid #d3d3d3;
  }
  &:focus {
    border: 1px solid ${(props) => props.theme.colors.darkYellow};
    outline: 1px solid ${(props) => props.theme.colors.darkYellow};
  }
`;

const BtnContainer = styled.div`
  margin: 2rem 0;
`;

const SubmitBtn = styled.button`
  width: 100%;
  height: 3rem;
  color: ${(props) => props.theme.colors.white};
  background-color: ${(props) => props.theme.colors.lightBlack};
  border-radius: 6px;
  padding: 0.1rem 0 0 0;
  font-size: 0.92rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${(props) => props.theme.colors.darkGray};
  }
`;
