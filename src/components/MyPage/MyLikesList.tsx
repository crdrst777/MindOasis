import { doc, getDoc } from "firebase/firestore";
import { dbService } from "../../fbase";
import { useEffect, useState } from "react";
import { PostType } from "../../types/types";
import { getUserData } from "../../api/user";

const MyLikesList = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [myLikes, setMyLikes] = useState<PostType[]>([]);
  const [userData, setUserData] = useState<any>({});

  const getMyLikes = async () => {
    try {
      const myLikesArr: PostType[] = [];
      if (userData.myLikes) {
        for (let postId of userData.myLikes) {
          const postDocRef = doc(dbService, "posts", `${postId}`);
          const postDocSnap = await getDoc(postDocRef);

          if (postDocSnap.exists()) {
            myLikesArr.push(postDocSnap.data());
          } else {
            console.log("Document does not exist");
          }
        }
      }
      setMyLikes(myLikesArr);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserData(userInfo.uid, setUserData);
  }, []);

  useEffect(() => {
    getMyLikes();
  }, [userData]);

  console.log("myLikes", myLikes);

  return (
    <div>
      {myLikes &&
        myLikes.map((post: PostType) => (
          <div key={post.createdAt}>{post.title}</div>
        ))}
    </div>
  );
};

export default MyLikesList;
