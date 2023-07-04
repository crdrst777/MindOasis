import React, { useEffect, useRef, useState } from "react";
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
  const [attachment, setAttachment] = useState<any>();
  const fileInput = useRef<HTMLInputElement>(null); // 기본값으로 null을 줘야함

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

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const theFile = e.currentTarget.files![0];
    console.log(theFile);
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      console.log("finishedEvent", finishedEvent);
      // console.log("result", reader.result);
      setAttachment(reader.result);
    }; // 파일을 다 읽으면 finishedEvent를 받는다.
    reader.readAsDataURL(theFile); // 그 다음 데이터를 얻는다.
  };
  // const onClearAttachment = () => setAttachment(null);
  const onClearAttachment = () => {
    setAttachment(null);
    fileInput.current!.value = "";
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" value={text} onChange={onChange} maxLength={120} />
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        <input type="submit" value="Submit" />
        {attachment && (
          <>
            <img src={attachment} width="50px" height="50px" alt="preview" />
            <button onClick={onClearAttachment}>Clear</button>
          </>
        )}
      </form>
      <div>
        {posts.map((post) => (
          <PostList
            key={post.id}
            post={post}
            isOwner={post.creatorId === userObj.uid}
          />
        ))}
      </div>
    </>
  );
};

export default Content;
