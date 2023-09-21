import { styled } from "styled-components";
import MyLikesList from "../../components/MyPage/MyLikesList";
import Sidebar from "../../components/MyPage/Sidebar";
import { useEffect, useState } from "react";
import { PostType } from "../../types/types";
import { dbService } from "../../fbase";
import { doc, getDoc } from "firebase/firestore";
import { getUserData } from "../../api/user";
import Pagination from "../../components/UI/Pagination";
import Loading from "../../components/UI/Loading";

const MyLikes = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [myLikes, setMyLikes] = useState<PostType[]>([]);
  const [userData, setUserData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);
  const lastPostIdx = currentPage * postsPerPage;
  const firstPostIdx = lastPostIdx - postsPerPage;
  const currentPosts = myLikes.slice(firstPostIdx, lastPostIdx);

  const getMyLikes = async () => {
    try {
      const myLikesArr: PostType[] = [];
      if (userData.myLikes) {
        for (let postId of userData.myLikes) {
          const postDocRef = doc(dbService, "posts", `${postId}`);
          const postDocSnap = await getDoc(postDocRef);

          if (postDocSnap.exists()) {
            // postDocSnap.data() -> post 데이터
            // postId를 각각의 데이터에 넣어줬음
            myLikesArr.push({ id: postId, ...postDocSnap.data() });
          } else {
            console.log("Document does not exist");
          }
        }
      }
      setMyLikes(myLikesArr);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserData(userInfo.uid, setUserData);
  }, []);

  useEffect(() => {
    setLoading(true);
    getMyLikes();
  }, [userData]);

  console.log("myLikes", myLikes);

  return (
    <MyPageContainer>
      <Container>
        <Sidebar linkTitle={"내 관심글"} />

        <MainContainer>
          {loading ? <Loading /> : null}

          {currentPosts.map((post) => (
            <MyLikesList key={post.id} post={post} />
          ))}
          <Pagination
            totalPosts={myLikes.length}
            postsPerPage={postsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </MainContainer>
      </Container>
    </MyPageContainer>
  );
};

export default MyLikes;

const MyPageContainer = styled.div`
  background-color: ${(props) => props.theme.colors.backgroundGray};
`;
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 57rem;
  margin: auto;
  padding: 4rem 0 7rem 0;
`;

const MainContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40.6rem;
  padding: 3.85rem 2.85rem 2.35rem 2.85rem;
  border: ${(props) => props.theme.borders.lightGray};
  border-radius: 1.4rem;
  background-color: ${(props) => props.theme.colors.white};
`;
