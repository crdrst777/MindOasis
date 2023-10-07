import { styled } from "styled-components";
import { authService } from "../../fbase";
import {
  EmailAuthProvider,
  User,
  reauthenticateWithCredential,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PasswordSchema } from "../../components/Auth/ValidationSchemas";
import Validations from "../../components/Auth/Validation";

interface Props {
  setIsReauthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Reauthenticate = ({ setIsReauthenticated }: Props) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(PasswordSchema),
    mode: "onChange",
  });

  const userRecertification = async (email: string, password: string) => {
    const user = authService.currentUser as User;
    const authCredential = EmailAuthProvider.credential(email, password);

    let bool;
    await reauthenticateWithCredential(user, authCredential)
      .then(() => {
        bool = true;
      })
      .catch((error) => {
        console.log(error);
        bool = false;
      });
    return bool;
  };

  const onSubmit = async (inputData: any) => {
    console.log("inputData", inputData);
    console.log("userInfo", userInfo);

    const result = await userRecertification(
      userInfo.email,
      inputData.password
    );
    console.log("result", result);

    // 재인증 여부에 따른 setState()
    if (result) {
      setIsReauthenticated(true);
    } else {
      setIsReauthenticated(false);
      alert("비밀번호가 맞지 않습니다. 다시 입력해주세요.");
    }
  };

  const onError = (error: any) => {
    console.log(error);
  };

  return (
    <>
      <UpdateForm onSubmit={handleSubmit(onSubmit, onError)}>
        <InputBlock>
          <InputLabel>비밀번호</InputLabel>
          <NewPasswordInput
            type="password"
            placeholder="유저 인증을 위해 비밀번호를 입력해주세요."
            {...register("password")}
          />
          {errors.password && <Validations value={errors.password.message} />}
        </InputBlock>

        <BtnContainer>
          <SubmitBtn type="submit">계정 삭제</SubmitBtn>
        </BtnContainer>
      </UpdateForm>
    </>
  );
};

export default Reauthenticate;

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
    outline: 1px solid #c9c9c9;
  }
  &:focus {
    outline: 1.8px solid ${(props) => props.theme.colors.yellow};
  }
`;

const BtnContainer = styled.div`
  margin: 1.6rem 0;
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

  @media ${(props) => props.theme.mobile} {
    /* width: 15rem;
    height: 3rem; */
  }
`;
