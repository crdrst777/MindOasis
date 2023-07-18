import React, { useEffect, useRef, useState } from "react";
import { dbService } from "../../fbase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import IPostType from "../../types/types";
import { styled } from "styled-components";
import SinglePost from "../../components/Post/SinglePost";

interface ContentProps {
  userObj: any | null;
}

const Content = ({ userObj }: ContentProps) => {
  const [posts, setPosts] = useState<IPostType[]>([]);

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
      const postsArr: IPostType[] = querySnapshot.docs.map((doc) => ({
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

  return (
    <Container>
      <PostList>
        {posts.map((post) => (
          <SinglePost
            key={post.id}
            post={post}
            isOwner={post.creatorId === userObj.uid}
          />
        ))}
      </PostList>
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
