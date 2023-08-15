import { useEffect, useState } from "react";
import { dbService } from "../../fbase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { PostType } from "../../types/types";
import { styled } from "styled-components";
import { PathMatch, useMatch, useParams } from "react-router-dom";
import Modal from "../../components/UI/Modal";
import PreviewPost from "../../components/Post/PreviewPost";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getUserData } from "../../api/user";

const Content = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // useMatch()의 인자로 url을 넘기면 해당 url과 일치할 경우 url의 정보를 반환하고, 일치하지 않을 경우 null을 반환한다.
  const bigMatch: PathMatch<string> | null = useMatch(`content/:id`);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [userData, setUserData] = useState<any>({});
  const { isLiked } = useSelector((state: RootState) => state.isLiked);

  // const getPosts = async () => {
  //   // const q = query(collection(dbService, "posts"));
  //   const dbPosts = await getDocs(collection(dbService, "posts"));
  //   dbPosts.forEach((doc) => {
  //     const postObj = {
  //       ...doc.data(),
  //       id: doc.id,
  //     };
  //     setPosts((prev) => [postObj, ...prev]);
  //     console.log("postObj", postObj);
  //   });
  // };

  const getPosts = () => {
    const q = query(
      collection(dbService, "posts"),
      orderBy("createdAt", "desc") // document를 글을 쓴 순서대로 차례대로 내림차순으로 정렬하기
    );
    onSnapshot(q, (querySnapshot) => {
      const postsArr: PostType[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsArr);
    });
  };

  useEffect(() => {
    getPosts();
    getUserData(userInfo.uid, setUserData);
  }, [isLiked]); // []를 주면 처음 한번 실행되는거지만, 여기서는 한번 구독하고 그후에는 Firebase의 데이터로 자동으로 업데이트되는것임.

  console.log(posts);
  console.log("userData", userData);
  console.log("bigMatch", bigMatch);

  return (
    <Container>
      <PreviewContainer>
        {posts.map((post) => (
          <PreviewPost key={post.id} post={post} />
        ))}
      </PreviewContainer>

      {bigMatch ? (
        <Modal userData={userData} postId={bigMatch?.params.id}></Modal>
      ) : null}
    </Container>
  );
};

export default Content;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 6rem 7rem;
`;

const PreviewContainer = styled.section`
  width: 100%;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, 17rem);
  column-gap: 2.2rem;
  row-gap: 2.2rem;
`;
