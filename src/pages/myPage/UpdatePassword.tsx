import { styled } from "styled-components";
import Sidebar from "../../components/MyPage/Sidebar";
import { useState } from "react";
import { authService } from "../../fbase";
import { updatePassword } from "firebase/auth";

const UpdatePasswordPage = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [checkPassword, setCheckPassword] = useState<string>("");

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (newPassword === checkPassword) {
      const user = authService.currentUser;

      updatePassword(user, newPassword)
        .then(() => {
          console.log("Update successful");
          alert("비밀번호가 변경되었습니다");
          setNewPassword("");
          setCheckPassword("");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("새로운 비밀번호와 비밀번호 확인이 일치하지 않습니다");
    }
  };

  const onChangeNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.currentTarget.value);
  };

  const onChangeCheckPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckPassword(e.currentTarget.value);
  };

  return (
    <MyPageContainer>
      <Container>
        <Sidebar linkTitle={"비밀번호 변경"} />
        <MainContainer>
          <InputBlock>
            <InputLabel>새로운 비밀번호</InputLabel>
            <NewPasswordInput
              type="password"
              value={newPassword}
              onChange={onChangeNewPassword}
              maxLength={8}
              placeholder="영문, 숫자, 특수문자 포함 6자 이상"
            />
          </InputBlock>
          <InputBlock>
            <InputLabel>비밀번호 확인</InputLabel>
            <CheckPasswordInput
              type="password"
              value={checkPassword}
              onChange={onChangeCheckPassword}
              maxLength={8}
            />
          </InputBlock>
          <BtnContainer>
            <SubmitBtn onClick={onSubmit}>저장하기</SubmitBtn>
          </BtnContainer>
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
  min-height: 37.5rem;
  padding: 3rem 3rem;
  border: ${(props) => props.theme.borders.lightGray};
  border-radius: 0.4rem;
  background-color: ${(props) => props.theme.colors.white};
`;

const InputBlock = styled.div`
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
  width: 16rem;
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

const CheckPasswordInput = styled.input`
  width: 16rem;
  min-height: 3rem;
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

const BtnContainer = styled.div`
  margin: 2rem 0;
`;

const SubmitBtn = styled.button`
  width: 16rem;
  height: 3rem;
  color: ${(props) => props.theme.colors.white};
  background-color: ${(props) => props.theme.colors.lightBlack};
  border-radius: 9px;
  padding: 0 1.25rem;
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
