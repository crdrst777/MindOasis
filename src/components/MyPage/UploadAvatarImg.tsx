import { styled } from "styled-components";
import { ReactComponent as EditIcon } from "../../assets/icon/edit-icon.svg";
import { ReactComponent as BasicAvatarIcon } from "../../assets/icon/avatar-icon.svg";
import { updateProfile } from "firebase/auth";
import { authService, dbService, storageService } from "../../fbase";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { handleImageCompress } from "../../api/image";

interface Props {
  newDisplayName: string;
  uploadPreview: any;
  setUploadPreview: React.Dispatch<React.SetStateAction<any>>;
  refreshUser: () => {};
  fileInput: any;
}

const UploadAvatarImg = ({
  newDisplayName,
  uploadPreview,
  setUploadPreview,
  refreshUser,
  fileInput,
}: Props) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [imageUpload, setImageUpload] = useState(null); // 기본값 null
  const userDocRef = doc(dbService, "users", `${userInfo.uid}`);

  // 이미지 리사이즈(압축) 함수를 실행하는 함수
  const runImageCompress = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.currentTarget?.files[0];
    const result = await handleImageCompress(file, 0.2);
    setImageUpload(result.compressedFile);
    setUploadPreview(result.urlFromFile);
  };

  // 파일을 첨부한 상태에서 clear 버튼을 누르는 경우
  const onClearUploadPreview = () => {
    setUploadPreview("");
    setImageUpload(null);
    // refreshUser(); // user를 새로고침
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
      } catch (error: any) {
        console.log(error.code);
      }
      window.location.reload();
      // refreshUser(); // user를 새로고침
    }
  };

  return (
    <Container>
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
          onChange={runImageCompress}
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
    </Container>
  );
};

export default UploadAvatarImg;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2.4rem 0 0 0;
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
