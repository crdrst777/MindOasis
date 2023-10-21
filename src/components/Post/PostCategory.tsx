import Category from "../UI/Category";
import { useEffect } from "react";
import { PostType } from "../../types/types";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

interface Props {
  posts: PostType[];
  checkedList: string[];
  matchingPosts: PostType[];
  setMatchingPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
  setIsUnmatched: React.Dispatch<React.SetStateAction<boolean>>;
  isAllPostBtnClicked: boolean;
}

const PostCategory = ({
  posts,
  checkedList,
  matchingPosts,
  setMatchingPosts,
  setIsUnmatched,
  isAllPostBtnClicked,
}: Props) => {
  const isChecked: boolean = useSelector(
    (state: RootState) => state.category.isChecked
  );

  // 카테고리 처음 클릭
  // 전체 post 중에 내가 클릭한 카ㄴ테고리와 일치하는 post가 있는지 조회 -> 일치하는 경우 postsArr배열에 post를 추가함
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
        setIsUnmatched(false);
      }
    }
    return postsArr;
  };

  // 카테고리가 2개 이상 클릭되있는 경우 (카테고리가 2개 클릭되있는 경우에 n -> 0 , 1)
  const matchingSeq2 = (
    n: number, // index // 빼는 경우엔 1
    postsArr: PostType[], // []
    matchingPosts: PostType[] // temp = [...matchingPosts]
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
          setIsUnmatched(false);
        }
      }
      console.log("seq2: postsArr", postsArr);

      // 일치하는 게시물이 없는 경우 - 위의 작업 후, 일치하지 않으면 여전히 빈[]임
      if (postsArr.length === 0) {
        console.log("일치하는 게시물이 없습니다");
        setIsUnmatched(true);
      }
    }
    return postsArr;
  };

  const getMatchingPosts = () => {
    let postsArr: PostType[] = [];
    let temp = [...matchingPosts];

    // 2. 클릭했던 걸 해제. 빼는 경우
    if (!isChecked) {
      // 추가할때 했던 동작을 반복
      // seq1->seq2

      // matchingSeq1의 리턴값을 가져온다.
      let resultPostsArr = matchingSeq1(postsArr);

      temp = [...resultPostsArr];

      // 반복문 돌면서 temp 값을 계속 바꿔줘서 이전에 추려진 matchingPosts를 계속 가져올 수 있음
      for (let i = 1; i < checkedList.length; i++) {
        temp = matchingSeq2(i, postsArr, temp); // checkedList[1]부터 조회
      }
      postsArr = temp;

      // 1. 버튼 클릭해서 카테고리를 추가하는 경우
    } else {
      // 1-1. 첫번째 추가 - matchingSeq1 실행
      if (checkedList.length === 1) {
        postsArr = matchingSeq1(postsArr);
        console.log("seq1: postsArr", postsArr);
      } else if (checkedList.length > 1) {
        // 1-2. 두번째 추가부터 - matchingSeq2 실행
        postsArr = matchingSeq2(checkedList.length - 1, postsArr, temp);
      }
    }
    setMatchingPosts(postsArr);
  };

  // 카테고리를 클릭할떼
  useEffect(() => {
    getMatchingPosts();
  }, [checkedList]);

  return (
    <>
      <Category isAllPostBtnClicked={isAllPostBtnClicked} />
    </>
  );
};

export default PostCategory;
