import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, storageService } from "../../fbase";
import { updateProfile } from "firebase/auth";
import {
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { styled } from "styled-components";
import MyPostList from "../../components/MyPage/MyPostList/MyPostList";

interface MyPageProps {
  userObj: any | null;
  refreshUser: () => any;
}

const MyPage = ({ userObj, refreshUser }: MyPageProps) => {
  const navigate = useNavigate();
  const [attachment, setAttachment] = useState<any>("");
  const fileInput = useRef<HTMLInputElement>(null); // 기본값으로 null을 줘야함
  const [newDisplayName, setNewDisplayName] = useState<string>(
    userObj.displayName
  );
  const photoURLRef = ref(storageService, authService!.currentUser!.photoURL!);

  const onLogOutClick = async () => {
    await authService.signOut();
    navigate("/");
  };

  // 프로필 업데이트
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let photoURL: string = "";

    // 파일 첨부시
    if (attachment) {
      // 기존 프로필 사진이 있는 경우 기존의 것을 스토리지에서 지워준다.
      if (userObj.photoURL !== null) {
        try {
          await deleteObject(photoURLRef);
        } catch (error: any) {
          console.log(error.code);
        }
      }

      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`); // 파일 경로 참조 생성
      await uploadString(attachmentRef, attachment, "data_url"); // 파일 업로드(이 경우는 url)
      await getDownloadURL(attachmentRef)
        .then((url) => {
          photoURL = url;
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // input창에 뭐라도 쓴 경우
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser!, {
        displayName: newDisplayName,
        photoURL: photoURL,
      });
    }
    // input창이 비어있거나 그대로인(파일만 올린) 경우
    if (newDisplayName === "" || newDisplayName === userObj.displayName) {
      await updateProfile(authService.currentUser!, {
        displayName: userObj.displayName,
        photoURL: photoURL,
      });
    }
    refreshUser();
    setAttachment(""); //파일 미리보기 img src 비워주기
    fileInput.current!.value = "";
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDisplayName(e.currentTarget.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const theFile = e.currentTarget.files![0];
    console.log(theFile);
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      console.log("finishedEvent", finishedEvent);
      setAttachment(reader.result);
    }; // 파일을 다 읽으면 finishedEvent를 받는다.
    reader.readAsDataURL(theFile); // 그 다음 데이터를 얻는다.
  };

  const onClearAttachment = () => {
    setAttachment("");
    fileInput.current!.value = ""; // 사진을 선택했다가 clear를 눌렀을때, 선택된 파일명을 지워줌.
  };

  // 프로필 사진 삭제
  const onDeleteClick = async () => {
    if (userObj.photoURL) {
      await updateProfile(authService.currentUser!, {
        displayName: newDisplayName,
        photoURL: "",
      });
      try {
        await deleteObject(photoURLRef);
      } catch (error: any) {
        console.log(error.code);
      }
      refreshUser();
    }
  };

  return (
    <MyPageContainer>
      <Container>
        <SideBar>
          <SideBarHeader></SideBarHeader>
          <MenuContainer>
            <li>회원정보 변경</li>
            <li>비밀번호 변경</li>
            <li>내 작성글</li>
            <li>내 관심글</li>
          </MenuContainer>
        </SideBar>

        <MainContainer>
          <button onClick={onDeleteClick}>Delete Avatar</button>

          <form onSubmit={onSubmit}>
            <input
              type="text"
              value={newDisplayName}
              onChange={onChange}
              placeholder="Display name"
            />
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              ref={fileInput}
            />
            <input type="submit" value="Update Profile" />
            {attachment && (
              <>
                <img
                  src={attachment}
                  width="50px"
                  height="50px"
                  alt="preview"
                />
                <button onClick={onClearAttachment}>Clear</button>
              </>
            )}
          </form>

          <button onClick={onLogOutClick}>Log Out</button>

          <MyPostList userObj={userObj} />
        </MainContainer>
      </Container>
    </MyPageContainer>
  );
};

export default MyPage;

const MyPageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${(props) => props.theme.colors.backgroundGray};
`;
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1100px;
  height: 800px;
  margin: auto;
  padding: 6rem 0 6rem 0;
`;
const SideBar = styled.aside`
  width: 280px;
  /* height: 100%; */
  border: 1px solid ${(props) => props.theme.colors.borderGray};
  border-radius: 0.4rem;
  padding: 3rem 2rem 3rem 2rem;
  background-color: ${(props) => props.theme.colors.white};
`;

const SideBarHeader = styled.header`
  height: 15rem;
  background-color: azure;
`;

const MenuContainer = styled.ul`
  margin-top: 4rem;
  /* background-color: azure; */

  li {
    margin-top: 2rem;
    font-size: ${(props) => props.theme.fontSizes.lg};
    /* font-weight: 400; */
  }
`;

const MainContainer = styled.section`
  width: 800px;
  height: 100%;
  border: 1px solid ${(props) => props.theme.colors.borderGray};
  border-radius: 0.4rem;
  background-color: ${(props) => props.theme.colors.white};
`;
