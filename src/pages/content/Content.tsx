import React, { useEffect, useState } from "react";
import { dbService } from "../../fbase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import PostList from "../../components/Post/PostList/PostList";
import IPostType from "../../types/types";

// interface ISnapshotData {
//   data?: DocumentData;
//   id: string;
// }

interface ContentProps {
  userObj: any | null;
}

const Content = ({ userObj }: ContentProps) => {
  const [text, setText] = useState("");
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

  // submit 할때마다 document를 생성
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(dbService, "posts"), {
        text: text,
        createdAt: Date.now(),
        creatorId: userObj.uid,
      });
      console.log("docRef", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    setText("");
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.currentTarget.value);
  };
  console.log(text);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input value={text} onChange={onChange} type="text" maxLength={120} />
        <input type="submit" value="submitTest" />
      </form>
      <div>
        {posts.map((post) => (
          <PostList key={post.id} post={post} />
        ))}
      </div>
    </>
  );
};

export default Content;
