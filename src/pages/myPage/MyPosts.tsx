import { styled } from "styled-components";
import MyPostList from "../../components/MyPage/MyPostsList";
import Sidebar from "../../components/MyPage/Sidebar";
import { useEffect, useState } from "react";
import { PostType } from "../../types/types";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { dbService } from "../../fbase";

interface Props {}

const MyPosts = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [myPosts, setMyPosts] = useState<PostType[]>([]);

  const getMyPosts = async () => {
    const myPostsArr: PostType[] = [];

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
  width: 1000px;
  margin: auto;
  padding: 5rem 0 7rem 0;
`;

const MainContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 720px;
  min-height: 40rem;
  padding: 3rem 3rem;
  border: 1px solid ${(props) => props.theme.colors.borderGray};
  border-radius: 0.4rem;
  background-color: ${(props) => props.theme.colors.white};
`;
