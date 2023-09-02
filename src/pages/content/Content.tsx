import { useEffect, useState } from "react";
import { dbService } from "../../fbase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { PostType } from "../../types/types";
import { styled } from "styled-components";
import { PathMatch, useMatch } from "react-router-dom";
import Modal from "../../components/UI/Modal";
import PreviewPost from "../../components/Post/PreviewPost";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getUserData } from "../../api/user";

const checkBoxList = [
  "자연",
  "도시",
  "뷰가 좋은",
  "인적이 드문",
  "예시1",
  "예시2",
  "예시3",
];

const Content = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // useMatch()의 인자로 url을 넘기면 해당 url과 일치할 경우 url의 정보를 반환하고, 일치하지 않을 경우 null을 반환한다.
  const bigMatch: PathMatch<string> | null = useMatch(`content/:id`);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [userData, setUserData] = useState<any>({});
  const { isLiked } = useSelector((state: RootState) => state.isLiked);

  // 클릭한 카테고리에 해당되는 게시물들이 들어가는 배열
  const [matchingPosts, setMatchingPosts] = useState<PostType[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [noMatchingPosts, setNoMatchingPosts] = useState(false);
  // checkBoxList 배열 중 check된 요소가 담기는 배열
  // 수정하는 페이지에서, 기존값에 체크되어있게 하기 위해 기존값을 넣어준다.
  const [checkedList, setCheckedList] = useState<string[]>([]);
  // const [checkedListBuffer, setCheckedListBuffer] = useState<string[]>([]);

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
      const postsArr: PostType[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsArr);
    });
  };

  useEffect(() => {
    getPosts();
    getUserData(userInfo.uid, setUserData);
  }, [isLiked]); // []를 주면 처음 한번 실행되는거지만, 여기서는 한번 구독하고 그후에는 Firebase의 데이터로 자동으로 업데이트되는것임.

  // input을 클릭했을때 checkedList라는 useState 배열에 해당 element가 포함되어있지 않다면 추가하고,
  // checkedList 배열에 이미 포함되어 있다면 해당 배열에서 제거하는 함수
  const checkedItemHandler = (value: string, isChecked: boolean) => {
    if (isChecked) {
      setCheckedList((prev) => [...prev, value]);
    } else if (!isChecked && checkedList.includes(value)) {
      setCheckedList(checkedList.filter((item) => item !== value));
    }
    // setRender((prev) => prev + 1);
  };

  // input을 클릭했을때 실행되는 함수
  const checkHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    setIsChecked(e.target.checked);
    checkedItemHandler(value, e.target.checked);
  };

  // 카테고리 처음 클릭
  // 전체 post 중에 내가 클릭한 카테고리와 일치하는 post가 있는지 조회 -> 일치하는 경우 postsArr배열에 post를 추가함
  const matchingSeq1 = (
    postsArr: PostType[] // []
  ) => {
    for (let post of posts) {
      const result = post.placeKeyword.filter(
        (item) => item === checkedList[0]
      );
      if (result.length === 1) {
        console.log("seq1: result", result);
        postsArr.push(post);
        // setMatchingPosts(postsArr);
        setNoMatchingPosts(false);
      }
    }
    return postsArr;
  };

  // 카테고리가 2개 이상 클릭되있는 경우 (카테고리가 2개 클릭되있는 경우에 n -> 0 , 1)
  const matchingSeq2 = (
    n: number, // index // 빼는 경우엔 1
    postsArr: PostType[], // []
    matchingPosts: PostType[] // temp = [...matchingPosts];
  ) => {
    // seq1에서 한 setMatchingPosts가 갱신이 안되어 값을(7개(자연)) 제대로 받아오지 못하고있음
    console.log("seq2: matchingPosts", matchingPosts);

    postsArr = [];

    // 일치하는 게시물이 있는 경우
    // 이전에 추려진 값들을 갖고있는 matchingPosts에서 더 추려내는 작업
    if (checkedList.length > 1) {
      // matchingPosts 중에 내가 클릭한 카테고리와 일치하는 post가 있는지 조회
      for (let matchingPost of matchingPosts) {
        const result = matchingPost.placeKeyword.filter(
          (item) => item === checkedList[n] // 마지막으로 추가된 요소와 비교
        );
        console.log("seq2: result", result);
        // 일치하는 경우 postsArr배열에 추가함
        if (result.length === 1) {
          postsArr.push(matchingPost);
          setNoMatchingPosts(false);
        }
      }
      console.log("seq2: postsArr", postsArr);

      // 일치하는 게시물이 없는 경우 - 위의 작업 후, 일치하지 않으면 여전히 빈[]임
      if (postsArr.length === 0) {
        console.log("일치하는 게시물이 없습니다");
        // postsArr = matchingPosts;
        // console.log("postsArr-일치하는 게시물이 없는 경우", postsArr);
        setNoMatchingPosts(true);
      }
    }
    return postsArr;
  };

  const getMatchingPosts = () => {
    let postsArr: PostType[] = [];
    let temp = matchingPosts;

    // 2. 클릭했던 걸 해제. 빼는 경우
    if (!isChecked) {
      console.log("뺐음");
      // 추가할때 했던 동작을 반복
      // seq1->seq2

      // matchingSeq1의 리턴값을 가져온다.
      let resultPostsArr = matchingSeq1(postsArr);
      // console.log("seq1: postsArr (get- 함수 내)", postsArr.length);
      // console.log("seq1: matchingPosts (get- 함수 내)", matchingPosts.length); // 갱신 안됨

      temp = [...resultPostsArr];
      console.log("temp", temp);

      // 반복문 돌면서 temp 값을 계속 바꿔줘서 이전에 추려진 matchingPosts를 계속 가져올 수 있음
      for (let i = 1; i < checkedList.length; i++) {
        //checkedList[checkedList.length - n]
        temp = matchingSeq2(i, postsArr, temp); // checkedList[1]부터 조회
        // console.log("seq2: matchingPosts (get- 함수 내)", matchingPosts.length);
      }
      postsArr = temp;

      // 1. 버튼 클릭해서 카테고리를 추가하는 경우
    } else {
      // 1-1. 첫번째 추가 - matchingSeq1 실행
      if (checkedList.length === 1) {
        postsArr = matchingSeq1(postsArr);
        console.log("seq1: postsArr", postsArr);
        // console.log("seq1: matchingPosts (get- 함수 내)", matchingPosts.length);
      } else if (checkedList.length > 1) {
        // 1-2. 두번째 추가부터 - matchingSeq2 실행
        postsArr = matchingSeq2(checkedList.length - 1, postsArr, temp);
        // console.log("seq2: matchingPosts (get- 함수 내)", matchingPosts.length);
      }
    }
    setMatchingPosts(postsArr);
  };

  useEffect(() => {
    getMatchingPosts();
  }, [checkedList]);

  // console.log("matchingPosts (get- 함수 밖", matchingPosts);
  // console.log("matchingPosts.length (get- 함수 밖", matchingPosts.length);
  console.log("checkedList", checkedList);

  return (
    <Container>
      <CategoryContainer>
        <CategoryWrapper>
          {checkedList ? (
            <>
              {checkBoxList.map((item, idx) => (
                <CheckBoxWrapper key={idx}>
                  <CheckBoxInput
                    type="checkbox"
                    id={item}
                    // Array.prototype.includes() -> 내부에 해당 요소(element)가 존재할 경우 true를 반환
                    checked={checkedList.includes(item)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      checkHandler(e, item)
                    }
                  />
                  <CheckBoxLabel htmlFor={item}>{item}</CheckBoxLabel>
                </CheckBoxWrapper>
              ))}
            </>
          ) : null}
        </CategoryWrapper>
      </CategoryContainer>

      <PreviewContainer>
        {noMatchingPosts ? (
          <div>일치하는 게시물이 없습니다</div>
        ) : (
          matchingPosts &&
          matchingPosts.map((post) => <PreviewPost key={post.id} post={post} />)
        )}
      </PreviewContainer>

      {bigMatch ? (
        <Modal userData={userData} postId={bigMatch?.params.id}></Modal>
      ) : null}
    </Container>
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
  margin: auto;
  margin-bottom: 3rem;
  width: 40rem;
  height: 3rem;
  /* background-color: aqua; */
`;

const CategoryWrapper = styled.div`
  width: 100%;
  height: 6rem;
  display: flex;
  justify-content: space-between;
`;

const CheckBoxWrapper = styled.div`
  margin-top: 0.9rem;
`;

// 원래의 인풋을 보이지 않는것처럼 멀리 보내버리고, 체크가 되었을 경우 라벨의 배경색, 글자색을 변경
const CheckBoxInput = styled.input`
  display: none;
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;

  &:checked + label {
    background-color: ${(props) => props.theme.colors.violet};
    color: ${(props) => props.theme.colors.white};
  }
`;

const CheckBoxLabel = styled.label`
  padding: 0.5rem 1rem;
  height: 2.25rem;
  cursor: pointer;
  border-radius: 2rem;
  background-color: ${(props) => props.theme.colors.lightGray};
  font-size: 0.85rem;
  font-weight: 400;
  color: ${(props) => props.theme.colors.black};
`;

const PreviewContainer = styled.section`
  width: 100%;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, 15.3rem);
  column-gap: 1.5rem;
  row-gap: 1.5rem;
`;
