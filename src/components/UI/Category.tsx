import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { styled } from "styled-components";
import { PostType } from "../../types/types";

const checkBoxList = [
  "자연",
  "도시",
  "뷰가 좋은",
  "인적이 드문",
  "예시1",
  "예시2",
  "예시3",
];

interface Props {
  posts: PostType[];
}

const Category = ({ posts }: Props) => {
  // 클릭한 카테고리에 해당되는 게시물들이 들어가는 배열
  const [matchingPosts, setMatchingPosts] = useState<PostType[]>([]);
  const [noMatchingPosts, setNoMatchingPosts] = useState(false);
  // checkBoxList 배열 중 check된 요소가 담기는 배열
  // 수정하는 페이지에서, 기존값에 체크되어있게 하기 위해 기존값을 넣어준다.
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);

  // input을 클릭했을때 checkedList라는 useState 배열에 해당 element가 포함되어있지 않다면 추가하고,
  // checkedList 배열에 이미 포함되어 있다면 해당 배열에서 제거하는 함수
  const checkedItemHandler = (value: string, isChecked: boolean) => {
    if (isChecked) {
      setCheckedList((prev) => [...prev, value]);
    } else if (!isChecked && checkedList.includes(value)) {
      setCheckedList(checkedList.filter((item) => item !== value));
    }
  };

  // input을 클릭했을때 실행되는 함수
  const checkHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    setIsChecked((prev) => !prev);
    checkedItemHandler(value, e.target.checked);
  };

  // const getMatchingPosts = () => {
  //   if (checkedList.length === 0) return;

  //   if (checkedList.length === 1) {
  //     const matchingPostsArr: PostType[] = [];

  //     for (let post of posts) {
  //       const result = post.placeKeyword.filter(
  //         (item) => item === checkedList[0]
  //       );
  //       if (result.length === 1) {
  //         matchingPostsArr.push(post);
  //         setMatchingPosts(matchingPostsArr);
  //       }
  //     }
  //   } else {
  //     const matchingPostsArr: PostType[] = [];

  //     for (let i = 1; i < checkedList.length; i++) {
  //       console.log("두번째 클릭");
  //       for (let matchingPost of matchingPosts) {
  //         const result = matchingPost.placeKeyword.filter(
  //           (item) => item === checkedList[i]
  //         );
  //         if (result.length === 1) {
  //           matchingPostsArr.push(matchingPost);
  //           setMatchingPosts(matchingPostsArr);
  //         }
  //       }
  //     }
  //     // if (matchingPostsArr.length === 0) {
  //     //   console.log("일치하는 게시물이 없습니다");
  //     // }
  //   }
  // };

  const getMatchingPosts = () => {
    for (let i = 0; i < checkedList.length; i++) {
      if (checkedList.length === 0) return;
      if (checkedList.length === 1) {
        const matchingPostsArr: PostType[] = [];

        for (let post of posts) {
          const result = post.placeKeyword.filter(
            (item) => item === checkedList[0]
          );
          if (result.length === 1) {
            matchingPostsArr.push(post);
            setMatchingPosts(matchingPostsArr);
            setNoMatchingPosts(false);
          }
        }
      } else {
        const matchingPostsArr: PostType[] = [];
        console.log("두번째 클릭");
        for (let matchingPost of matchingPosts) {
          const result = matchingPost.placeKeyword.filter(
            (item) => item === checkedList[i]
          );
          if (result.length === 1) {
            matchingPostsArr.push(matchingPost);
            setMatchingPosts(matchingPostsArr);
            setNoMatchingPosts(false);
          }
        }

        if (matchingPostsArr.length === 0) {
          console.log("일치하는 게시물이 없습니다");
          // setMatchingPosts([]);
          setNoMatchingPosts(true);
        }
        // 빈 배열이 된 다음 다시 취소했을때 그 전으로 돌아와야 되는데 여전히 []임. 당연함.
        // --> setNoMatchingPosts(true); 이런식으로 바꿈
      }
    }
  };

  console.log("matchingPosts", matchingPosts);
  console.log("matchingPosts.length", matchingPosts.length);

  // 클릭한 카테고리에 해당되는 게시물을 찾아주는 함수
  // const getMatchingPosts = async () => {
  //   const matchingPostsArr: PostType[] = [];

  //   const q = query(
  //     collection(dbService, "posts"),
  //     where("placeKeyword", "==", checkedList), // where -> 필터링하는 방법을 알려줌
  //     orderBy("createdAt", "desc") // document를 글을 쓴 순서대로 차례대로 내림차순으로 정렬하기
  //   );

  //   // getDocs()메서드로 쿼리 결과 값 가져오기
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     matchingPostsArr.push(
  //       (doc.id,
  //       "=>",
  //       {
  //         id: doc.id,
  //         ...doc.data(),
  //       })
  //     );
  //   });
  //   setMatchingPosts(matchingPostsArr);

  //   // 아래 방식으로 해도됨
  //   querySnapshot.forEach((doc) => {
  //     const docData = (doc.id, " => ", doc.data());
  //     const postsArr: PostType[] = [
  //       {
  //         id: doc.id,
  //         ...docData,
  //       },
  //     ];
  //     setMatchingPosts(postsArr);
  //   });
  // };

  useEffect(() => {
    getMatchingPosts();
  }, [checkedList]);

  console.log("checkedList", checkedList);
  // console.log("posts", posts);

  return (
    <Container>
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

      {noMatchingPosts ? "일치하는 게시물이 없습니다" : null}
    </Container>
  );
};

export default Category;

const Container = styled.div`
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
