import { styled } from "styled-components";
import { ReactComponent as HeartIcon } from "../../assets/icon/heart-icon.svg";
import { doc, updateDoc } from "firebase/firestore";
import { PostType, UserDocType } from "../../types/types";
import { dbService } from "../../fbase";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setLikeBtnClickedReducer } from "../../store/likeBtnClickedSlice";

interface Props {
  post: PostType;
  postId: string;
  userData: UserDocType;
}

const PostLike = ({ post, postId, userData }: Props) => {
  const dispatch = useDispatch();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userDocRef = doc(dbService, "users", `${userInfo?.uid}`); // 현재 로그인한 유저를 가리키는 참조 생성
  // const [likeBtnClicked, setLikeBtnClicked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  // const test = useParams().id;

  // like 버튼 클릭시 실행되는 함수
  const onLikeBtnClick = async () => {
    // 내가 쓴 게시물이라면 alert창 뜨도록 하기
    if (post.creatorId === userData.uid) {
      alert("내가 작성한 게시물입니다");
      return;
    }
    // userData.myLikes 배열이 없거나 값이 0개인 경우 -> 처음으로 추가
    if (!userData.myLikes || userData.myLikes.length === 0) {
      await updateDoc(userDocRef, {
        myLikes: [postId],
      });
      setIsLiked(true);
      return;
    }
    // userData.myLikes 배열에 값이 이미 있는 경우
    if (userData.myLikes.length > 0) {
      console.log("userData.myLikes 배열에 값이 이미 있는 경우");
      // 현재 postId와 동일한 userData.myLikes가 있는 경우 그 postId를 담는 배열. 값이 있는지에 따라 추가/삭제 동작 여부를 나눌 수 있다.
      const equalPostId: string[] = userData.myLikes.filter(
        (i) => i === postId
      );
      // 추가 - 현재 postId가 userData.myLikes 에 없는 경우
      if (equalPostId.length === 0) {
        console.log("현재 postId가 userData.myLikes 에 없는 경우");
        await updateDoc(userDocRef, {
          myLikes: [...userData.myLikes, postId],
        });
        setIsLiked(true);
      }
      // 삭제 - 현재 postId가 userData.myLikes 에 이미 있는 경우
      if (equalPostId.length !== 0) {
        console.log("현재 postId가 userData.myLikes 에 이미 있는 경우");
        const myLikesArr = userData.myLikes.filter(
          (item: string) => item !== postId
        );
        await updateDoc(userDocRef, {
          myLikes: myLikesArr,
        });
        setIsLiked(false);
      }
    }
  };

  useEffect(() => {
    dispatch(setLikeBtnClickedReducer(isLiked));
  }, [isLiked]);

  // 현재 게시물이 현재 유저가 좋아요했던 게시물이면 setIsLiked(true); -> 모달의 하트를 노란색으로 보여주기 위한
  useEffect(() => {
    if (userData?.myLikes?.length > 0) {
      for (let i of userData.myLikes) {
        if (i === postId) {
          setIsLiked(true);
        }
      }
    } else {
      setIsLiked(false);
    }
  }, []);

  return (
    <Container>
      <LikeBtn onClick={onLikeBtnClick} $likestate={isLiked}>
        <HeartIcon />
      </LikeBtn>
    </Container>
  );
};

export default PostLike;

const Container = styled.div``;

const LikeBtn = styled.button<{ $likestate: boolean }>`
  width: 2.25rem;
  height: 1.8rem;
  background-color: ${(props) => props.theme.colors.white};
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.9px solid
    ${(props) => (props.$likestate ? props.theme.colors.yellow : "#c1c1c1")};
  border-radius: 3px;
  cursor: pointer;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${(props) =>
      props.$likestate ? props.theme.colors.yellow : "#787878"};
  }

  svg {
    width: 2.25rem;
    height: 1.8rem;
    padding: 0.47rem;
    fill: ${(props) =>
      props.$likestate ? props.theme.colors.yellow : props.theme.colors.gray};

    transition: fill 0.03s ease;
    &:hover {
      fill: ${(props) =>
        props.$likestate ? props.theme.colors.yellow : "#616161"};
    }
  }
`;
