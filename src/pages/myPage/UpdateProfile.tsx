import { useRef, useState } from "react";
import { styled } from "styled-components";
import { authService, dbService, storageService } from "../../fbase";
import { updateProfile } from "firebase/auth";
import {
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { doc, updateDoc } from "firebase/firestore";
import imageCompression from "browser-image-compression";
import Validations from "../../components/Auth/Validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UpdateProfileSchema } from "../../components/Auth/ValidationSchemas";
import { ReactComponent as EditIcon } from "../../assets/icon/edit-icon.svg";
import { ReactComponent as BasicAvatarIcon } from "../../assets/icon/avatar-icon.svg";
import Sidebar from "../../components/MyPage/Sidebar";
import { Link, useNavigate } from "react-router-dom";

interface Props {
  refreshUser: () => any;
}

const UpdateProfile = ({ refreshUser }: Props) => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [imageUpload, setImageUpload] = useState(null); // 기본값 null
  const [uploadPreview, setUploadPreview] = useState<any>(""); // ""
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

  // 프로필 업데이트
  const onSubmit = async (inputData: any) => {
    let userObj = {
      displayName: inputData.nickname,
      photoURL: "",
    };

    // 파일 첨부시
    if (uploadPreview) {
      // 기존 프로필 사진이 있는 경우 기존의 것을 스토리지에서 지워준다.
      if (userInfo.photoURL !== null) {
        try {
          const userAuthURLRef = ref(storageService, userInfo.photoURL);
          await deleteObject(userAuthURLRef);
          console.log("??");
        } catch (error: any) {
          console.log(error.code);
        }
      }

      const attachmentRef = ref(storageService, `${userInfo.uid}/${uuidv4()}`); // 파일 경로 참조 생성
      console.log("attachmentRef", attachmentRef);

      await uploadString(attachmentRef, uploadPreview, "data_url"); // 파일 업로드(이 경우는 url)

      await getDownloadURL(attachmentRef)
        .then((url) => {
          userObj.photoURL = url;
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // 파일 업로드 o
    if (userObj.photoURL !== "") {
      console.log("파일 업로드 o");
      userObj = {
        ...userObj,
      };
    } // 파일 업로드 x
    else if (userObj.photoURL === "") {
      console.log("파일 업로드 x");
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

    refreshUser();
    setUploadPreview(""); // 파일 미리보기 img src 비워주기
    fileInput.current!.value = "";
    // window.location.reload();
  };

  // 이미지 리사이즈(압축) 함수
  const handleImageCompress = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let file = e.currentTarget?.files[0];
    const options = {
      maxSizeMB: 0.2, // 이미지 최대 용량
      // maxWidthOrHeight: 1920, // 최대 넓이(혹은 높이)
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      setImageUpload(compressedFile);
      const promise = imageCompression.getDataUrlFromFile(compressedFile);
      promise.then((result) => {
        setUploadPreview(result);
      });
    } catch (err) {
      console.log(err);
    }
  };

  // 파일을 첨부한 상태에서 clear 버튼을 누르는 경우
  const onClearUploadPreview = () => {
    setUploadPreview("");
    setImageUpload(null);
  };

  // 프로필 사진 삭제
  const onDeleteClick = async () => {
    if (userInfo.photoURL) {
      await updateProfile(authService.currentUser!, {
        displayName: newDisplayName,
        photoURL: "",
      });
      await updateDoc(userDocRef, {
        photoURL: "",
      });

      // 파일 삭제
      try {
        const userAuthURLRef = ref(storageService, userInfo.photoURL);
        await deleteObject(userAuthURLRef);
        console.log("??");
      } catch (error: any) {
        console.log(error.code);
      }
      refreshUser(); // user를 새로고침
    }
  };

  const onError = (error: any) => {
    console.log(error);
  };

  console.log("uploadPreview", uploadPreview);

  return (
    <MyPageContainer>
      <Container>
        <Sidebar linkTitle={"회원정보 변경"} />

        <MainContainer>
          <UpdateForm onSubmit={handleSubmit(onSubmit, onError)}>
            <FileContainer>
              <AvatarContainer htmlFor="input-file">
                {uploadPreview ? (
                  <AvatarImg src={uploadPreview} alt="profile photo" />
                ) : userInfo.photoURL ? (
                  <AvatarImg src={userInfo.photoURL} alt="profile photo" />
                ) : (
                  <BasicAvatarIconWrapper>
                    <BasicAvatarIcon />
                  </BasicAvatarIconWrapper>
                )}

                <FileInput
                  id="input-file"
                  type="file"
                  accept="image/*"
                  onChange={handleImageCompress}
                  ref={fileInput}
                />

                <EditIconWrapper>
                  <EditIcon />
                </EditIconWrapper>
              </AvatarContainer>

              <DelBtnWrapper>
                {uploadPreview ? (
                  <DelBtn onClick={onClearUploadPreview}>삭제</DelBtn>
                ) : userInfo.photoURL ? (
                  <DelBtn onClick={onDeleteClick}>삭제</DelBtn>
                ) : null}
              </DelBtnWrapper>
            </FileContainer>

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

          <Link to="/mypage/deleteaccount">
            <DeleteAccountBtn>계정 삭제</DeleteAccountBtn>
          </Link>
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
  min-height: 36.7rem;
  padding: 1.8rem;
  border: ${(props) => props.theme.borders.lightGray};
  border-radius: 1.4rem;
  background-color: ${(props) => props.theme.colors.white};
`;

const UpdateForm = styled.form`
  width: 18rem;
`;

const FileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2.5rem 0 0 0;
`;

const AvatarContainer = styled.label`
  width: 9.7rem;
  height: 9.7rem;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
`;

const AvatarImg = styled.img`
  width: 9.7rem;
  height: 9.7rem;
  border-radius: 50%;
  object-fit: cover;
`;

const BasicAvatarIconWrapper = styled.div`
  svg {
    width: 9.7rem;
    height: 9.7rem;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const FileInput = styled.input`
  display: none;
  width: 9.7rem;
  height: 9.7rem;
  position: absolute;
`;

const EditIconWrapper = styled.div`
  position: absolute;
  width: 2.3rem;
  height: 2.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.yellow};
  border: 0.2rem solid white;
  border-radius: 50%;
  cursor: pointer;
  right: 0.3rem;
  bottom: 0.4rem;

  svg {
    width: 1.3rem;
  }
`;

const DelBtnWrapper = styled.div``;

const DelBtn = styled.button`
  margin-top: 1rem;
  width: 2.25rem;
  height: 1.8rem;
  padding-top: 0.13rem;
  background-color: ${(props) => props.theme.colors.white};
  border: 0.9px solid #c1c1c1;
  border-radius: 3px;
  color: ${(props) => props.theme.colors.gray};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.moreLightGray};
    border-color: #959595;
    color: #6e6e6e;
  }
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

  @media ${(props) => props.theme.mobile} {
    /* width: 15rem;
    height: 3rem; */
  }
`;

const DeleteAccountBtn = styled.button`
  color: #a6a6a6;
  font-size: 0.82rem;
  font-weight: 400;
`;
