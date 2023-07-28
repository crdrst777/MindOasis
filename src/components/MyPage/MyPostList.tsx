import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { dbService } from "../../fbase";
import { useEffect, useState } from "react";
import { PostType } from "../../types/types";

interface MyPostListProps {}

const MyPostList = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [myPosts, setMyPosts] = useState<PostType[]>([]);

  const getMyPosts = async () => {
    const myPostArr: PostType[] = [];

    // dbService의 컬렉션 중 "posts" Docs에서 userInfo의 uid와 동일한 creatorID를 가진 모든 문서를 내림차순으로 가져오는 쿼리(요청) 생성
    const q = query(
      collection(dbService, "posts"),
      where("creatorId", "==", userInfo.uid), // where -> 필터링하는 방법을 알려줌
      orderBy("createdAt", "desc")
    );
    // getDocs()메서드로 쿼리 결과 값 가져오기
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      myPostArr.push(
        (doc.id,
        "=>",
        {
          id: doc.id,
          ...doc.data(),
        })
      );
    });
    setMyPosts(myPostArr);
  };

  useEffect(() => {
    getMyPosts();
  }, []);

  console.log("myPosts", myPosts);

  return (
    <div>
      {myPosts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
};

export default MyPostList;
