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
  const creatorDocRef = doc(dbService, "users", `${post.creatorId}`); // 파일을 가리키는 참조 생성
  const [creator, setCreator] = useState<any>({});
  const userDocRef = doc(dbService, "users", `${userInfo.uid}`); // 파일을 가리키는 참조 생성
  const [user, setUser] = useState<any>({});

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

  const onLikeBtnClick = async () => {
    if (user.myLikes) {
      await updateDoc(userDocRef, {
        myLikes: [...user.myLikes, postId],
      });
    } else {
      await updateDoc(userDocRef, {
        myLikes: [postId],
      });
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
