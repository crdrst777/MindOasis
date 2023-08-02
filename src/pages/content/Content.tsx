import { useEffect, useState } from "react";
import { dbService } from "../../fbase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { PostType } from "../../types/types";
import { styled } from "styled-components";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import Modal from "../../components/UI/Modal";
import PreviewPost from "../../components/Post/PreviewPost";

interface ContentProps {}

const Content = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const bigMatch: PathMatch<string> | null = useMatch(`content/detail/:id`);
  // const { placeKeyword } = useSelector(
  //   (state: RootState) => state.placeKeyword
  // );

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
      // console.log("querySnapshot.docs", querySnapshot.docs);
      const postsArr: PostType[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsArr);
    });
  };

  useEffect(() => {
    getPosts();
  }, []); // []를 주면 처음 한번 실행되는거지만, 여기서는 한번 구독하고 그후에는 Firebase의 데이터로 자동으로 업데이트되는것임.

  console.log("posts", posts);
  // console.log("placeKeyword", placeKeyword);

  return (
    <Container>
      <PreviewContainer>
        {posts.map((post) => (
          <PreviewPost key={post.id} post={post} />
        ))}
      </PreviewContainer>

      {bigMatch ? <Modal postId={bigMatch?.params.id}></Modal> : null}
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
