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
import { EmailAuthProvider, deleteUser } from "firebase/auth";

const WithdrawAccount = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [myPostsId, setMyPostsId] = useState<string[]>([]);
  const [myCommentsId, setMyCommentsId] = useState<string[]>([]);
  const userDocRef = doc(dbService, "users", `${userInfo.uid}`); // 파일을 가리키는 참조 생성
  const user = authService.currentUser;

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

  // 회원 탈퇴 버튼을 눌렀을때 실행되는 함수
  const withdrawAccount = async () => {
    const ok = window.confirm("정말 탈퇴 하시겠습니까?");
    if (!ok) return;

    try {
      await deleteUser(user); // 계정 삭제
      await deleteDoc(userDocRef); // user document 삭제
      await deletePosts();
      await deleteComments();

      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/");
      window.location.reload();
    } catch (error: any) {
      console.log(error.code);
    }
  };

  console.log("myPostsId", myPostsId.length);
  console.log("myCommentsId", myCommentsId.length);

  return (
    <>
      <WithdrawAccountBtn onClick={withdrawAccount}>
        회원 탈퇴
      </WithdrawAccountBtn>
    </>
  );
};

export default WithdrawAccount;

const WithdrawAccountBtn = styled.button`
  color: #aaaaaa;
  font-size: 0.82rem;
  font-weight: 400;
`;
