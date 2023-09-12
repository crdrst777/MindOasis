import { styled } from "styled-components";
import { ReactComponent as HeartIcon } from "../../assets/icon/heart-icon.svg";
import { doc, updateDoc } from "firebase/firestore";
import { PostType, UserDocType } from "../../types/types";
import { dbService } from "../../fbase";
import { useDispatch } from "react-redux";
import { setIsLikedReducer } from "../../store/isLikedSlice";
import { useEffect, useState } from "react";

interface Props {
  post: PostType;
  postId: string;
  userData: UserDocType;
}

const PostLike = ({ post, postId, userData }: Props) => {
  const dispatch = useDispatch();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [isLiked, setIsLiked] = useState(false);
  const postDocRef = doc(dbService, "posts", `${postId}`); // 현재 게시물을 가리키는 참조 생성
  const userDocRef = doc(dbService, "users", `${userInfo?.uid}`); // 현재 로그인한 유저를 가리키는 참조 생성

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
      await updateDoc(postDocRef, {
        likeState: true,
        likedUsers: [...post.likedUsers, userData.uid],
      });
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

        await updateDoc(postDocRef, {
          likeState: true,
          likedUsers: [...post.likedUsers, userData.uid],
        });
      }

      // 삭제 - 현재 postId가 userData.myLikes 에 이미 있는 경우
      if (equalPostId.length !== 0) {
        console.log("현재 postId가 userData.myLikes 에 이미 있는 경우");
        const myLikesArr = userData.myLikes.filter(
          (item: string) => item !== postId
        );
        const likedUsersArr = post.likedUsers.filter(
          (item: string) => item !== userInfo.uid
        );

        await updateDoc(userDocRef, {
          myLikes: myLikesArr,
        });
        // 왜 모달을 닫았다가 다시 열면 이게 실행이 안되지?
        await updateDoc(postDocRef, {
          likeState: false,
          likedUsers: likedUsersArr,
        });
      }
    }
    setIsLiked((prev: any) => !prev);
  };

  // useEffect(() => {
  //   if (post.creatorId === userData.uid) {
  //     const test = async () => {
  //       await updateDoc(postDocRef, {
  //         likeState: false,
  //       });
  //     };
  //     test();
  //   }
  // }, [post, postId, userData]);

  useEffect(() => {
    dispatch(setIsLikedReducer(isLiked));
  }, [isLiked]);

  // if (equalUserId !== 0 ) {
  //   likedUsers: likedUsersArr,
  // }

  // 내가 이미 좋아요 누른 상태에서 모달을 닫았다가 다시 열고 좋아요를 누르면 같은 id가 쌓인다.
  // -> console.log("현재 postId가 userData.myLikes 에 없는 경우")가 뜸. 그럼 <추가> 조건으로 간다는건데
  // 아래것만 실행됨.
  // await updateDoc(postDocRef, {
  //   likeState: true,
  //   likedUsers: [...post.likedUsers, userData.uid],
  // });

  // 콘솔에 찍히는 userData.myLikes에는 공교롭게도 해당게시물의 id가 없다. 그래서 <추가> 조건으로 넘어가는것임.
  // 삭제할땐 상위 컴포넌트에서 받아온 userData에서 myLikes에 해당게시물 id가 삭제되는게 갱신?되는데
  // 추가할땐 갱신이 안된다. 그래서 값이 없다고 나와서 조건 성립이 안되는것.

  return (
    <Container>
      <LikeBtn onClick={onLikeBtnClick} $likestate={post.likeState}>
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
  /* opacity: 85%; */
  &:hover {
    border-color: ${(props) =>
      props.$likestate ? props.theme.colors.yellow : "#787878"};
    /* opacity: 100%; */
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
