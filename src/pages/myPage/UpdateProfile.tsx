import { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { authService, dbService, storageService } from "../../fbase";
import { updateProfile } from "firebase/auth";
import { ref, deleteObject } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import Validations from "../../components/Auth/Validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UpdateProfileSchema } from "../../components/Auth/ValidationSchemas";
import Sidebar from "../../components/MyPage/Sidebar";
import { useNavigate } from "react-router-dom";
import UploadAvatarImg from "../../components/MyPage/UploadAvatarImg";
import { uploadImage } from "../../api/image";

interface Props {
  refreshUser: () => any;
}

const UpdateProfile = ({ refreshUser }: Props) => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [isSocialLogin, setIsSocialLogin] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string>(""); // ""
  const fileInput = useRef<HTMLInputElement>(null); // 기본값 null

  const [newDisplayName, setNewDisplayName] = useState<string>(
    userInfo.displayName
  );
  // `${userInfo.uid}`이 자리엔 원래 documentId 값이 들어가야하는데 문서 생성시 uid값으로 documentId를 만들어줬었음. 동일한 값임.
  const userDocRef = doc(dbService, "users", `${userInfo.uid}`);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(UpdateProfileSchema),
    mode: "onChange",
  });

  // 소셜 로그인 여부 체크
  useEffect(() => {
    const user = authService.currentUser;
    if (user.providerData[0].providerId === "google.com") {
      setIsSocialLogin(true);
    }
  }, []);

  const uploadFile = async (userObj: {
    displayName: string;
    photoURL: string;
  }) => {
    // 파일 첨부시
    if (uploadPreview) {
      // 기존 프로필 사진이 있는 경우 기존의 것을 스토리지에서 지워준다.
      if (userInfo.photoURL !== null) {
        try {
          const userAuthURLRef = ref(storageService, userInfo.photoURL);
          await deleteObject(userAuthURLRef);
        } catch (error: any) {
          console.log(error.code);
        }
      }

      userObj.photoURL = await uploadImage(uploadPreview);
    }
  };

  // 프로필 업데이트
  const onSubmit = async (inputData: any) => {
    let userObj = {
      displayName: inputData.nickname,
      photoURL: "",
    };

    await uploadFile(userObj);

    // 파일 업로드 o
    if (userObj.photoURL !== "") {
      userObj = {
        ...userObj,
      };
    } // 파일 업로드 x
    else if (userObj.photoURL === "") {
      userObj = {
        ...userObj,
        photoURL: userInfo.photoURL,
      };
    }

    // auth 업데이트
    await updateProfile(authService.currentUser!, userObj);

    // 도큐먼트(db) 업데이트
    await updateDoc(userDocRef, {
      ...userObj,
    });

    setUploadPreview(""); // 파일 미리보기 img src 비워주기
    fileInput.current!.value = "";
    window.location.reload();
    // refreshUser();
  };

  const onError = (error: any) => {
    console.log(error);
  };

  const goToDeleteAccount = () => {
    if (!isSocialLogin) {
      navigate("/mypage/deleteaccount");
    } else {
      alert("소셜 로그인 계정은 삭제할 수 없습니다.");
    }
  };

  return (
    <MyPageContainer>
      <Container>
        <Sidebar linkTitle={"회원정보 변경"} />

        <MainContainer>
          <UpdateForm onSubmit={handleSubmit(onSubmit, onError)}>
            <UploadAvatarImg
              newDisplayName={newDisplayName}
              uploadPreview={uploadPreview}
              setUploadPreview={setUploadPreview}
              refreshUser={refreshUser}
              fileInput={fileInput}
            />

            <InputBlock>
              <InputLabel>닉네임</InputLabel>
              <NicknameInput
                type="text"
                placeholder={newDisplayName}
                {...register("nickname")}
              />
              {errors.nickname && (
                <Validations value={errors.nickname.message} />
              )}
            </InputBlock>

            <BtnContainer>
              <SubmitBtn type="submit">저장하기</SubmitBtn>
            </BtnContainer>
          </UpdateForm>

          <DeleteAccountBtn onClick={goToDeleteAccount}>
            계정 삭제
          </DeleteAccountBtn>
        </MainContainer>
      </Container>
    </MyPageContainer>
  );
};

export default UpdateProfile;

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
  padding: 1.8rem;
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
  margin-top: 2.7rem;
`;

const InputLabel = styled.label`
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 0.315rem;
  color: ${(props) => props.theme.colors.darkGray};
`;

const NicknameInput = styled.input`
  height: 3rem;
  font-size: 0.97rem;
  color: ${(props) => props.theme.colors.moreDarkGray};
  padding: 0 0.8rem;
  border-radius: 6px;
  border: ${(props) => props.theme.borders.lightGray};
  &:hover {
    outline: 1px solid #d3d3d3;
  }
  &:focus {
    border: 1px solid ${(props) => props.theme.colors.darkYellow};
    outline: 1px solid ${(props) => props.theme.colors.darkYellow};
  }
`;

const BtnContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3.5rem;
`;

const SubmitBtn = styled.button`
  margin: 1.6rem 0 1.8rem 0;
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

const DeleteAccountBtn = styled.button`
  color: #a6a6a6;
  font-size: 0.82rem;
  font-weight: 400;
  margin-bottom: 0.8rem;
`;
