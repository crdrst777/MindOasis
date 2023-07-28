import { useEffect, useState } from "react";
import { dbService } from "../../fbase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { PostType } from "../../types/types";
import { styled } from "styled-components";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import Modal from "../../components/UI/Modal";

interface ContentProps {}

const Content = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const navigate = useNavigate(); // useNavigate 훅을 사용하면 url을 왔다갔다할 수 있음.
  const bigMatch: PathMatch<string> | null = useMatch(`content/detail/:id`);

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

  const onPostClick = (id: any) => {
    navigate(`/content/detail/${id}`); // 이 url로 바꿔줌.
  };

  console.log("posts", posts);

  return (
    <Container>
      <PostList>
        {posts.map((post) => (
          <SinglePostContainer
            key={post.id}
            onClick={() => onPostClick(post.id)}
          >
            {post.attachmentUrl && (
              <PreviewImg src={post.attachmentUrl} alt="image" />
            )}
            <div>{post?.title}</div>
          </SinglePostContainer>
        ))}
      </PostList>

      {bigMatch ? <Modal postId={bigMatch?.params.id}></Modal> : null}
    </Container>
  );
};

export default Content;

const Container = styled.div`
  width: 80%;
  margin: auto;
  padding: 5rem 0;
`;

const PostList = styled.section``;

const SinglePostContainer = styled.div`
  display: inline-block;
  margin: 1.3rem;
`;

const PreviewImg = styled.img`
  width: 17rem;
  height: 17rem;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 3px 0px;
  object-fit: cover;
`;
