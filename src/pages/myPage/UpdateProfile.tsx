import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService, storageService } from "../../fbase";
import { updateProfile } from "firebase/auth";
import {
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { styled } from "styled-components";
import avatar from "../../assets/img/avatar-icon.png";
import Sidebar from "../../components/MyPage/Sidebar";
import { doc, updateDoc } from "firebase/firestore";
import imageCompression from "browser-image-compression";

interface UpdateProfileProps {
  refreshUser: () => any;
}

const UpdateProfile = ({ refreshUser }: UpdateProfileProps) => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [imageUpload, setImageUpload] = useState(null);
  const [uploadPreview, setUploadPreview] = useState<any>("");
  const fileInput = useRef<HTMLInputElement>(null); // 기본값으로 null을 줘야함
  const [newDisplayName, setNewDisplayName] = useState<string>(
    userInfo.displayName
  );
  const userAuthURLRef = ref(
    storageService,
    authService!.currentUser!.photoURL!
  );

  // `${userInfo.uid}`이 자리엔 원래 documentId 값이 들어가야하는데 문서 생성시 uid값으로 documentId를 만들어줬었음. 동일한 값임.
  const userDocRef = doc(dbService, "users", `${userInfo.uid}`); // 파일을 가리키는 참조 생성

  const onLogOutClick = async () => {
    await authService.signOut();
    navigate("/");
    window.location.reload();
  };

  // 프로필 업데이트
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let userObj = {
      displayName: newDisplayName,
      photoURL: "",
    };
    // let photoURL = "";

    // 파일 첨부시
    if (uploadPreview) {
      // 기존 프로필 사진이 있는 경우 기존의 것을 스토리지에서 지워준다.
      if (userInfo.photoURL !== null) {
        try {
          await deleteObject(userAuthURLRef);
        } catch (error: any) {
          console.log(error.code);
        }
      }

      const attachmentRef = ref(storageService, `${userInfo.uid}/${uuidv4()}`); // 파일 경로 참조 생성
      await uploadString(attachmentRef, uploadPreview, "data_url"); // 파일 업로드(이 경우는 url)
      await getDownloadURL(attachmentRef)
        .then((url) => {
          userObj.photoURL = url;
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // input창에 입력하고, 파일도 올린 경우
    if (userInfo.displayName !== newDisplayName && userObj.photoURL !== "") {
      userObj = {
        ...userObj,
      };
    } else if (userInfo.displayName !== newDisplayName) {
      // input창에 입력한 경우
      userObj = {
        ...userObj,
        photoURL: userInfo.photoURL,
      };
    } else if (
      // 파일만 올린 경우 (input창이 비어있거나 그대로인)
      newDisplayName === "" ||
      newDisplayName === userInfo.displayName
    ) {
      userObj = {
        displayName: userInfo.displayName,
        ...userObj,
      };
    }

    // auth 업데이트
    await updateProfile(authService.currentUser!, userObj);

    // 도큐먼트(db) 업데이트
    await updateDoc(userDocRef, {
      ...userObj,
    });

    refreshUser();
    setUploadPreview(""); //파일 미리보기 img src 비워주기
    fileInput.current!.value = "";
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDisplayName(e.currentTarget.value);
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
    fileInput.current!.value = ""; // 사진을 선택했다가 clear를 눌렀을때, 선택된 파일명을 지워줌.
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

      try {
        await deleteObject(userAuthURLRef);
      } catch (error: any) {
        console.log(error.code);
      }
      refreshUser();
    }
  };

  return (
    <MyPageContainer>
      <Container>
        <Sidebar linkTitle={"회원정보 변경"} />
        <MainContainer>
          <FileContainer>
            <AvatarContainer>
              {userInfo.photoURL ? (
                <img src={userInfo.photoURL} alt="profile photo" />
              ) : (
                <BasicAvatarIcon />
              )}
            </AvatarContainer>
            <button onClick={onDeleteClick}>Delete Avatar</button>
            <FileInput
              type="file"
              accept="image/*"
              onChange={handleImageCompress}
              ref={fileInput}
            />
            {uploadPreview && (
              <>
                <img
                  src={uploadPreview}
                  width="50px"
                  height="50px"
                  alt="preview"
                />
                <button onClick={onClearUploadPreview}>Clear</button>
              </>
            )}
          </FileContainer>

          <InputBlock>
            <InputLabel>닉네임</InputLabel>
            <NicknameInput
              type="text"
              value={newDisplayName}
              onChange={onChange}
              maxLength={30}
            />
          </InputBlock>

          <BtnContainer>
            <SubmitBtn onClick={onSubmit}>저장하기</SubmitBtn>
          </BtnContainer>

          <button onClick={onLogOutClick}>Log Out</button>
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
  align-items: center;
  width: 40.6rem;
  min-height: 37.5rem;
  padding: 1.8rem;
  border: ${(props) => props.theme.borders.lightGray};
  border-radius: 0.4rem;
  background-color: ${(props) => props.theme.colors.white};
`;

const FileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AvatarContainer = styled.div`
  width: 9rem;
  height: 9rem;
  border-radius: 50%;
  margin: 2rem 0 1rem 0;

  img {
    width: 9rem;
    height: 9rem;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const BasicAvatarIcon = styled.img.attrs({
  src: avatar,
})`
  width: 9rem;
  height: 9rem;
  object-fit: cover;
  border-radius: 50%;
`;

const FileInput = styled.input`
  width: 16rem;
  font-size: 0.9rem;
  color: ${(props) => props.theme.colors.moreDarkGray};
  padding: 0 1.2rem;
  margin: 1rem 0;
  border-radius: 5px;
  border: ${(props) => props.theme.borders.lightGray};
  cursor: pointer;
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

const NicknameInput = styled.input`
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

const BtnContainer = styled.div`
  margin: 1.4rem 0;
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
