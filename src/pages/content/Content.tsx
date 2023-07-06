import React, { useEffect, useRef, useState } from "react";
import { dbService } from "../../fbase";
import { storageService } from "../../fbase";
import { v4 as uuidv4 } from "uuid";
import {
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
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
  const [attachment, setAttachment] = useState<any>("");
  // 사진 첨부 없이 텍스트만 트윗하고 싶을 때도 있으므로 기본 값을 ""로 해야한다. 트윗할 때 텍스트만 입력시 이미지 url ""로 비워두기 위함
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
    let attachmentUrl: string = "";

    if (attachment) {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`); // 파일 경로 참조 생성
      await uploadString(attachmentRef, attachment, "data_url"); // 파일 업로드(이 경우는 url)
      await getDownloadURL(attachmentRef)
        .then((url) => {
          attachmentUrl = url;
        })
        .catch((err) => {
          console.log(err);
        });
    }
    const postObj = {
      text: text,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    await addDoc(collection(dbService, "posts"), postObj);
    setText("");
    setAttachment(""); //파일 미리보기 img src 비워주기
    fileInput.current!.value = "";
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.currentTarget.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const theFile = e.currentTarget.files![0];
    console.log(theFile);
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      console.log("finishedEvent", finishedEvent);
      setAttachment(reader.result);
    }; // 파일을 다 읽으면 finishedEvent를 받는다.
    reader.readAsDataURL(theFile); // 그 다음 데이터를 얻는다.
  };

  const onClearAttachment = () => {
    setAttachment("");
    fileInput.current!.value = ""; // 사진을 선택했다가 clear를 눌렀을때, 선택된 파일명을 지워줌.
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
