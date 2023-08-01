import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { PostType } from "../../types/types";
import { doc, getDoc } from "firebase/firestore";
import { dbService } from "../../fbase";
import { ReactComponent as HeartIcon } from "../../assets/icon/heart-icon.svg";
import avatar from "../../assets/img/avatar-icon.png";

interface ModalHeaderProps {
  post: PostType;
}

const ModalHeader = ({ post }: ModalHeaderProps) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // `${post.creatorId}` ->  users db의 documentId와 동일. documentId로 해당 user 데이터 찾기
  const userDocRef = doc(dbService, "users", `${post.creatorId}`); // 파일을 가리키는 참조 생성
  const [user, setUser] = useState<any>({});

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
    getUser();
  }, [post]);

  console.log("user", user);

  return (
    <Header>
      <UserInfo>
        <AvatarContainer>
          {userInfo.photoURL ? (
            <img src={userInfo.photoURL} alt="profile photo" />
          ) : (
            <BasicAvatarIcon />
          )}
        </AvatarContainer>
        <Nickname>{user.displayName}</Nickname>
      </UserInfo>
      <LikeBtn>
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
  background-color: orange;

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
