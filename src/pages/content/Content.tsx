import React, { useEffect, useState } from "react";
import { dbService } from "../../fbase";
import { DocumentData, collection, addDoc, getDocs } from "firebase/firestore";

interface ISnapshotData {
  data?: DocumentData;
  id: string;
}

const Content = () => {
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState<ISnapshotData[]>([]);

  const getPosts = async () => {
    // const q = query(collection(dbService, "posts"));

    const dbPosts = await getDocs(collection(dbService, "posts"));
    dbPosts.forEach((doc) => {
      const postsObj = {
        ...doc.data(),
        id: doc.id,
      };
      setPosts((prev) => [postsObj, ...prev]);
    });
  };

  useEffect(() => {
    getPosts();
  }, []);

  console.log(posts);

  // submit 할때마다 document를 생성하는거임.
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(dbService, "posts"), {
        post: post,
        createdAt: Date.now(),
      });
      console.log("docRef", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    setPost("");
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost(e.currentTarget.value);
  };
  console.log(post);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input value={post} onChange={onChange} type="text" maxLength={120} />
        <input type="submit" value="submitTest" />
      </form>
    </>
  );
};

export default Content;
