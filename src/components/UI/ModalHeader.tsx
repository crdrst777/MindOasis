import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { PostType } from "../../types/types";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { dbService } from "../../fbase";
import { ReactComponent as HeartIcon } from "../../assets/icon/heart-icon.svg";
import avatar from "../../assets/img/avatar-icon.png";

interface Props {
  post: PostType;
  postId: string;
}

const ModalHeader = ({ post, postId }: Props) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // `${post.creatorId}` ->  users db의 documentId와 동일. documentId로 해당 user 데이터 찾기
  const postDocRef = doc(dbService, "posts", `${postId}`); // 현재 게시물을 가리키는 참조 생성
  const creatorDocRef = doc(dbService, "users", `${post.creatorId}`); // 게시물 작성자를 가리키는 참조 생성
  const [creator, setCreator] = useState<any>({});
  const userDocRef = doc(dbService, "users", `${userInfo.uid}`); // 현재 로그인한 유저를 가리키는 참조 생성
  const [user, setUser] = useState<any>({});
  const [isLiked, setIsLiked] = useState(false);

  const getCreator = async () => {
    try {
      const creatorDocSnap = await getDoc(creatorDocRef);
      if (creatorDocSnap.exists()) {
        setCreator(creatorDocSnap.data());
      } else {
        console.log("creator document does not exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setUser(userDocSnap.data());
      } else {
        console.log("User document does not exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCreator();
    getUser();
  }, [post, postId]);

  const updateLikedUsers = async () => {
    try {
      if (post.likedUsers) {
        await updateDoc(postDocRef, {
          likedUsers: [...post.likedUsers, userInfo.uid],
        });
      } else {
        await updateDoc(postDocRef, {
          likedUsers: [userInfo.uid],
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // like 버튼 클릭시 실행되는 함수
  const onLikeBtnClick = async () => {
    try {
      let equalElArr = user.myLikes.filter((item: string) => item === postId);

      // 내가 쓴 게시물이라면 alert창 뜨도록 하기
      if (post.creatorId === user.uid) {
        alert("내가 작성한 게시물입니다");
        // post의 id와 동일한 요소가 user의 myLikes 배열 안에 이미 있다면, 배열 안에서 제거한다.
      } else if (equalElArr.length !== 0) {
        const unequalElArr = user.myLikes.filter(
          (item: string) => item !== postId
        );
        const unequalLikedUsersArr = post.likedUsers.filter(
          (item: string) => item !== userInfo.uid
        );
        await updateDoc(userDocRef, {
          myLikes: unequalElArr,
        });
        await updateDoc(postDocRef, {
          likedUsers: unequalLikedUsersArr,
        });
      } else {
        // 기존에 좋아요 게시물이 있는 경우. 기존것에 추가
        if (user.myLikes) {
          await updateDoc(userDocRef, {
            myLikes: [...user.myLikes, postId],
          });
          // 좋아요 게시물을 처음 누른 경우
        } else {
          await updateDoc(userDocRef, {
            myLikes: [postId],
          });
        }
        updateLikedUsers();
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log("user", user);

  return (
    <Header>
      <UserInfo>
        <AvatarContainer>
          {creator.photoURL ? (
            <img src={creator.photoURL} alt="profile photo" />
          ) : (
            <BasicAvatarIcon />
          )}
        </AvatarContainer>
        <Nickname>{creator.displayName}</Nickname>
      </UserInfo>
      <LikeBtn onClick={onLikeBtnClick}>
        <HeartIcon />
      </LikeBtn>
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

const LikeBtn = styled.button`
  width: 2.6rem;
  height: 2rem;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #d1d1d1;
  border-radius: 3px;
  cursor: pointer;
  transition: border-color 0.2s ease;
  &:hover {
    border-color: ${(props) => props.theme.colors.darkGray};
  }

  svg {
    width: 2.6rem;
    height: 2rem;
    padding: 0.45rem;
    fill: ${(props) => props.theme.colors.gray};
    transition: fill 0.3s ease;
    &:hover {
      fill: ${(props) => props.theme.colors.darkGray};
    }
  }
`;
