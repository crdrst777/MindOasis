import { styled } from "styled-components";
import MyPostList from "../../components/MyPage/MyPostsList";
import Sidebar from "../../components/MyPage/Sidebar";
import { useEffect, useState } from "react";
import { PostType } from "../../types/types";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { dbService } from "../../fbase";

const MyPosts = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [myPosts, setMyPosts] = useState<PostType[]>([]);

  const getMyPosts = async () => {
    const myPostsArr: PostType[] = [];

    // query 함수를 사용하면서 여기에 인자로 orderBy 함수나 where 함수 등을 사용
    // dbService의 컬렉션 중 "posts" Docs에서 userInfo의 uid와 동일한 creatorID를 가진 모든 문서를 내림차순으로 가져오는 쿼리(요청) 생성
    const q = query(
      collection(dbService, "posts"),
      where("creatorId", "==", userInfo.uid), // where -> 필터링하는 방법을 알려줌
      orderBy("createdAt", "desc")
    );
    // getDocs()메서드로 쿼리 결과 값 가져오기
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      myPostsArr.push(
        (doc.id,
        "=>",
        {
          id: doc.id,
          ...doc.data(),
        })
      );
    });
    setMyPosts(myPostsArr);
  };

  useEffect(() => {
    getMyPosts();
  }, []);

  console.log("myPosts", myPosts);

  return (
    <MyPageContainer>
      <Container>
        <Sidebar linkTitle={"내 작성글"} />
        <MainContainer>
          {myPosts.map((post) => (
            <MyPostList key={post.id} post={post} />
          ))}
        </MainContainer>
      </Container>
    </MyPageContainer>
  );
};

export default MyPosts;

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
  height: 37.5rem;
  padding: 2.85rem;
  border: ${(props) => props.theme.borders.lightGray};
  border-radius: 0.4rem;
  background-color: ${(props) => props.theme.colors.white};
`;
