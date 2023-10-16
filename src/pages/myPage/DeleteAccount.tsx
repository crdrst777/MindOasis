import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router";
import { styled } from "styled-components";
import { authService, dbService } from "../../fbase";
import { useEffect, useState } from "react";
import Sidebar from "../../components/MyPage/Sidebar";
import Reauthenticate from "../../components/Auth/Reauthenticate";
import { deleteUser } from "firebase/auth";

const DeleteAccount = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [myPostsId, setMyPostsId] = useState<string[]>([]);
  const [myCommentsId, setMyCommentsId] = useState<string[]>([]);
  const userDocRef = doc(dbService, "users", `${userInfo.uid}`); // 파일을 가리키는 참조 생성
  const user = authService.currentUser;

  const [isReauthenticated, setIsReauthenticated] = useState(false);

  const getMyPosts = async () => {
    const myPostsIdArr: string[] = [];
    const q = query(
      collection(dbService, "posts"),
      where("creatorId", "==", userInfo.uid) // where -> 필터링하는 방법을 알려줌
    );
    // getDocs()메서드로 쿼리 결과 값 가져오기
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      myPostsIdArr.push((doc.id, "=>", doc.id));
    });
    setMyPostsId(myPostsIdArr);
  };

  const getMyComments = async () => {
    const myCommentsIdArr: string[] = [];
    const q = query(
      collection(dbService, "comments"),
      where("userId", "==", userInfo.uid) // where -> 필터링하는 방법을 알려줌
    );
    // getDocs()메서드로 쿼리 결과 값 가져오기
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      myCommentsIdArr.push((doc.id, "=>", doc.id));
    });
    setMyCommentsId(myCommentsIdArr);
  };

  useEffect(() => {
    getMyPosts();
    getMyComments();
  }, []);

  const deletePosts = async () => {
    for (let postId of myPostsId) {
      const postRef = doc(dbService, "posts", `${postId}`); // 파일을 가리키는 참조 생성
      try {
        await deleteDoc(postRef);
        console.log("게시물 삭제 실행");
      } catch (error: any) {
        console.log(error.code);
      }
    }
  };

  const deleteComments = async () => {
    for (let commentId of myCommentsId) {
      const commentRef = doc(dbService, "comments", `${commentId}`); // 파일을 가리키는 참조 생성
      try {
        await deleteDoc(commentRef);
        console.log("댓글 삭제 실행");
      } catch (error: any) {
        console.log(error.code);
      }
    }
  };

  // 비밀번호 입력 후 - 계정 삭제 버튼을 눌렀을때 실행되는 함수
  const deleteAccount = async () => {
    const ok = window.confirm("정말 계정을 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await deleteUser(user); // 계정 삭제
      await deleteDoc(userDocRef); // user document 삭제
      await deletePosts();
      await deleteComments();

      alert("계정 삭제가 완료되었습니다.");
      navigate("/");
      window.location.reload();
    } catch (error: any) {
      console.log(error.code);
    }
  };

  useEffect(() => {
    if (isReauthenticated) {
      deleteAccount();
    }
  }, [isReauthenticated]);

  console.log("myPostsId", myPostsId.length);
  console.log("myCommentsId", myCommentsId.length);

  return (
    <MyPageContainer>
      <Container>
        <Sidebar linkTitle={"회원정보 변경"} />

        <MainContainer>
          <Text>
            <h3>계정 삭제 유의사항</h3>
            <p>
              • 회원 가입 시 제공된 정보는 모두 파기됩니다.
              <br />
              • 유저가 작성했던 게시글과 댓글은 모두 삭제됩니다.
              <br />• 탈퇴된 계정은 복구 될 수 없습니다.
            </p>
          </Text>
          <Reauthenticate
            inputLabel={"비밀번호"}
            btnText={"계정 삭제"}
            setIsReauthenticated={setIsReauthenticated}
          />
        </MainContainer>
      </Container>
    </MyPageContainer>
  );
};

export default DeleteAccount;

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
  border-radius: 1.4rem;
  background-color: ${(props) => props.theme.colors.white};
`;

const Text = styled.div`
  width: 18rem;
  margin-bottom: 3rem;

  h3 {
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 0.6rem;
    text-decoration: underline 0.2rem ${(props) => props.theme.colors.yellow};
  }

  p {
    font-size: 0.85rem;
    line-height: 1.3rem;
  }
`;
