import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "../../fbase";
import IPostType from "../../types/types";

interface MyPageProps {
  userObj: any | null;
}

const MyPage = ({ userObj }: MyPageProps) => {
  const navigate = useNavigate();

  const onLogOutClick = async () => {
    await authService.signOut();
    navigate("/");
  };

  // where -> 필터링하는 방법을 알려줌
  const getMyPosts = async () => {
    // dbService의 컬렉션 중 "posts" Docs에서 userObj의 uid와 동일한 creatorID를 가진 모든 문서를 내림차순으로 가져오는 쿼리(요청) 생성
    const q = query(
      collection(dbService, "posts"),
      where("creatorId", "==", userObj.uid) // document를 글을 쓴 순서대로 차례대로 내림차순으로 정렬하기
      // orderBy("createdAt", "desc")
    );
    // getDocs()메서드로 쿼리 결과 값 가져오기
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  };
  useEffect(() => {
    getMyPosts();
  }, []);

  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default MyPage;
