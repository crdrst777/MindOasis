import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { PostType, UserDocType } from "../../types/types";
import { doc, getDoc } from "firebase/firestore";
import { dbService } from "../../fbase";
import avatar from "../../assets/img/avatar-icon.png";
import PostLike from "../Post/PostLike";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import DetailsDropdown from "./DetailsDropdown";

interface Props {
  post: PostType;
  postId: string;
  userData: UserDocType;
}

const ModalHeader = ({ post, postId, userData }: Props) => {
  // `${post.creatorId}` ->  users db의 documentId와 동일. documentId로 해당 user 데이터 찾기
  const creatorDocRef = doc(dbService, "users", `${post.creatorId}`); // 게시물 작성자를 가리키는 참조 생성
  const [creatorData, setCreatorData] = useState<any>({});

  const getCreatorData = async () => {
    try {
      const creatorDocSnap = await getDoc(creatorDocRef);
      if (creatorDocSnap.exists()) {
        setCreatorData(creatorDocSnap.data());
      } else {
        console.log("creator document does not exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCreatorData();
  }, [post, postId]);
  // reload 이 값을 안 넣으면 좋아요 버튼 클릭 후 바로 또 클릭했을때 클릭이 안됨.

  // const updateLikedUsers = async () => {
  //   try {
  //     if (post.likedUsers) {
  //       await updateDoc(postDocRef, {
  //         likedUsers: [...post.likedUsers, userInfo.uid],
  //       });
  //     } else {
  //       await updateDoc(postDocRef, {
  //         likedUsers: [userInfo.uid],
  //       });
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // // like 버튼 클릭시 실행되는 함수
  // const onLikeBtnClick = async () => {
  //   try {
  //     let equalElArr = userData.myLikes.filter(
  //       (item: string) => item === postId
  //     );

  //     // 내가 쓴 게시물이라면 alert창 뜨도록 하기
  //     if (post.creatorId === userData.uid) {
  //       alert("내가 작성한 게시물입니다");
  //       // post의 id와 동일한 요소가 user의 myLikes 배열 안에 이미 있다면, 배열 안에서 제거한다.
  //     } else if (equalElArr.length !== 0) {
  //       const unequalElArr = userData.myLikes.filter(
  //         (item: string) => item !== postId
  //       );
  //       const unequalLikedUsersArr = post.likedUsers.filter(
  //         (item: string) => item !== userInfo.uid
  //       );
  //       await updateDoc(userDocRef, {
  //         myLikes: unequalElArr,
  //       });
  //       await updateDoc(postDocRef, {
  //         likedUsers: unequalLikedUsersArr,
  //       });
  //       setIsLiked(false);
  //     } else {
  //       // 기존에 좋아요 게시물이 있는 경우. 기존것에 추가
  //       if (userData.myLikes) {
  //         await updateDoc(userDocRef, {
  //           myLikes: [...userData.myLikes, postId],
  //         });
  //         // 좋아요 게시물을 처음 누른 경우
  //       } else {
  //         await updateDoc(userDocRef, {
  //           myLikes: [postId],
  //         });
  //       }
  //       updateLikedUsers();
  //       setIsLiked(true);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <Header>
      <UserInfo>
        <AvatarContainer>
          {creatorData.photoURL ? (
            <img src={creatorData.photoURL} alt="profile photo" />
          ) : (
            <BasicAvatarIcon />
          )}
        </AvatarContainer>
        <Nickname>{creatorData.displayName}</Nickname>
      </UserInfo>

      {/* <PostLike post={post} postId={postId} userData={userData} /> */}
      {post.creatorId === userData.uid ? (
        <>
          <BtnContainer>
            <PostLike post={post} postId={postId} userData={userData} />
            <DetailsDropdown></DetailsDropdown>
          </BtnContainer>
        </>
      ) : (
        <PostLike post={post} postId={postId} userData={userData} />
      )}
    </Header>
  );
};

export default ModalHeader;

const Header = styled.header`
  height: 4.5rem;
  padding: 0.6rem 1.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  /* background-color: beige; */
`;

const AvatarContainer = styled.div`
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 50%;

  img {
    width: 2.7rem;
    height: 2.7rem;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const BasicAvatarIcon = styled.img.attrs({
  src: avatar,
})`
  width: 2.5rem;
  height: 2.5rem;
  object-fit: cover;
  border-radius: 50%;
`;

const Nickname = styled.div`
  color: ${(props) => props.theme.colors.black};
  font-size: 1.1rem;
  font-weight: 500;
  margin-left: 0.8rem;
`;

const BtnContainer = styled.div`
  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
`;
