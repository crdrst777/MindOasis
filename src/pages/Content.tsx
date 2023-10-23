import { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { PostType } from "../types/types";
import { styled } from "styled-components";
import { PathMatch, useMatch } from "react-router-dom";
import Modal from "../components/UI/Modal";
import PreviewPost from "../components/Post/PreviewPost";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { getUserData } from "../api/user";
import Pagination from "../components/UI/Pagination";
import { setPlaceKeywordReducer } from "../store/placeKeywordSlice";
import { setSearchedPostsReducer } from "../store/searchedPostsSlice";
import PostCategory from "../components/Post/PostCategory";
import Banner from "../components/Layout/Banner";

const Content = () => {
  const dispatch = useDispatch();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // useMatch()의 인자로 url을 넘기면 해당 url과 일치할 경우 url의 정보를 반환하고, 일치하지 않을 경우 null을 반환한다.
  const bigMatch: PathMatch<string> | null = useMatch(`content/:id`);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [userData, setUserData] = useState<any>({}); // userInfo의 userId를 통해 얻은 userData
  const [isAllPostBtnClicked, setIsAllPostBtnClicked] = useState(false); // '전체' 버튼 클릭 여부
  const { likeBtnClicked } = useSelector(
    (state: RootState) => state.likeBtnClicked
  );

  const { searchedPosts } = useSelector(
    (state: RootState) => state.searchedPosts
  ); // 검색한 결과값

  // category
  const [matchingPosts, setMatchingPosts] = useState<PostType[]>([]); // 클릭한 카테고리에 해당되는 게시물들이 들어가는 배열
  const [isUnmatched, setIsUnmatched] = useState(false); // 클릭한 카테고리에 해당되는 게시물이 없는지 여부
  const checkedList: string[] = useSelector(
    (state: RootState) => state.category.checkedList
  );

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(16);
  const lastPostIdx = currentPage * postsPerPage;
  const firstPostIdx = lastPostIdx - postsPerPage;
  const currentPosts = matchingPosts.slice(firstPostIdx, lastPostIdx);

  const getPosts = () => {
    // query 함수를 사용하면서 여기에 인자로 orderBy 함수 등을 사용. dbService의 컬렉션 중 "posts" Docs에서 찾음
    const q = query(
      collection(dbService, "posts"),
      orderBy("createdAt", "desc") // document를 글을 쓴 순서대로 차례대로 내림차순으로 정렬하기
    );
    // 실시간으로 문서 업데이트 가져오기 (onSnapshot) - 사용자가 새로고침을 하지 않고도 데이터 변경이 실시간으로 반영된다.
    onSnapshot(q, (querySnapshot) => {
      const postsArr: PostType[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsArr);
    });
  };

  useEffect(() => {
    getPosts();
    dispatch(setPlaceKeywordReducer([]));
  }, [dispatch]); // []를 주면 처음 한번 실행되는거지만, 여기서는 한번 구독하고 그후에는 Firebase의 데이터로 자동으로 업데이트되는것임.

  useEffect(() => {
    if (searchedPosts.length > 0) {
      setMatchingPosts(searchedPosts);
      setIsAllPostBtnClicked(false);
    } else {
      setMatchingPosts(posts);
      setIsUnmatched(false);
    }
  }, [posts, searchedPosts]);

  // 유저가 좋아요 버튼을 누르거나 취소했을때 유저 정보를 다시 가져와 좋아요 부분을 변경해준다? -> 추후에 다시 확인해보기
  useEffect(() => {
    if (userInfo) {
      getUserData(userInfo.uid, setUserData); // 리턴값 -> setUserData(userDocSnap.data());
    }
  }, [likeBtnClicked]);

  const allPostBtnClick = () => {
    setMatchingPosts([...posts]);
    setIsAllPostBtnClicked(true);
    setIsUnmatched(false);
    dispatch(setSearchedPostsReducer([]));
  };

  // 카테고리를 클릭할떼
  useEffect(() => {
    setCurrentPage(1);

    if (checkedList.length > 0) {
      setIsAllPostBtnClicked(false);
    } else {
      if (searchedPosts.length > 0) {
        setMatchingPosts([...searchedPosts]);
        setIsAllPostBtnClicked(false);
      } else {
        setMatchingPosts([...posts]);
        setIsAllPostBtnClicked(true);
      }
    }
  }, [checkedList]);

  const isLikedPost = (postId: string) => {
    if (userData?.myLikes?.length > 0) {
      for (let i of userData.myLikes) {
        if (i === postId) {
          return true;
        }
      }
    }
  };

  return (
    <>
      <Banner />
      <Container>
        <CategoryContainer>
          <AllPostBtn
            onClick={allPostBtnClick}
            $isallpostbtnclicked={isAllPostBtnClicked}
          >
            전체
          </AllPostBtn>
          <PostCategory
            posts={posts}
            checkedList={checkedList}
            matchingPosts={matchingPosts}
            setMatchingPosts={setMatchingPosts}
            setIsUnmatched={setIsUnmatched}
            isAllPostBtnClicked={isAllPostBtnClicked}
          />
        </CategoryContainer>

        <ContentContainer>
          {isUnmatched ? (
            <AlertText>일치하는 게시물이 없습니다.</AlertText>
          ) : (
            <PreviewContainer>
              {currentPosts &&
                currentPosts.map((post) => (
                  <PreviewPost
                    key={post.id}
                    post={post}
                    userData={userData}
                    likestate={isLikedPost(post.id)}
                  />
                ))}
            </PreviewContainer>
          )}
        </ContentContainer>

        <Pagination
          totalPosts={matchingPosts.length}
          postsPerPage={postsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        {bigMatch ? (
          <Modal userData={userData} postId={bigMatch?.params.id}></Modal>
        ) : null}
      </Container>
    </>
  );
};

export default Content;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 3rem 7.3rem 6rem 7.3rem;
`;

const CategoryContainer = styled.section`
  margin: 0 auto;
  margin-bottom: 3rem;
  width: 40rem;
  height: 3rem;
  display: flex;
  justify-content: space-between;
`;

const AllPostBtn = styled.button<{ $isallpostbtnclicked: boolean }>`
  padding-top: 0.15rem;
  margin-top: 0.32rem;
  margin-right: 1.16rem;
  width: 4.2rem;
  height: 2.39rem;
  cursor: pointer;
  /* border-radius: 2rem; */
  border-radius: 0.8rem;
  border: ${(props) =>
    props.$isallpostbtnclicked ? "none" : "0.1rem solid #dedede"};
  transition: background-color 0.2s ease;
  background-color: ${(props) =>
    props.$isallpostbtnclicked ? "#ffe787" : "none"};
  font-size: 0.87rem;
  font-weight: 600;
  color: ${(props) =>
    props.$isallpostbtnclicked ? props.theme.colors.black : "#747474"};
`;

const ContentContainer = styled.section`
  width: 100%;
  height: 100%;
  margin-bottom: 1.4rem;
`;

const AlertText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-top: 3.9rem;
  padding-bottom: 6rem;
  font-size: 1.1rem;
  font-weight: 400;
`;

const PreviewContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, 15.3rem);
  column-gap: 1.3rem;
  row-gap: 1.3rem;
  margin-bottom: 0.5rem;
`;
