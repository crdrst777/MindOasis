import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { PostType, UserDocType } from "../../types/types";
import { doc, getDoc } from "firebase/firestore";
import { dbService } from "../../fbase";

interface ModalHeaderProps {
  post: PostType;
}

const ModalHeader = ({ post }: ModalHeaderProps) => {
  // `${post.creatorId}` ->  users db의 documentId와 동일. documentId로 해당 user 데이터 찾기
  const userDocRef = doc(dbService, "users", `${post.creatorId}`); // 파일을 가리키는 참조 생성
  // const [user, setUser] = useState<UserDocType>({});

  const [user, setUser] = useState<any>({});

  const getUser = async () => {
    try {
      const userDocSnap = await getDoc(userDocRef);
      console.log("userDocSnap", userDocSnap);

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
          {/* <img src={userInfo.photoURL} alt="profile photo" /> */}
        </AvatarContainer>
        <Nickname>{user.displayName}</Nickname>
      </UserInfo>
      <LikeBtn>
        <button>like</button>
      </LikeBtn>
    </Header>
  );
};

export default ModalHeader;

const Header = styled.header`
  height: 4.5rem;
  padding: 0.6rem 1.5rem;
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

const Nickname = styled.div`
  color: ${(props) => props.theme.colors.black};
  font-size: 1.1rem;
  font-weight: 500;
  margin-left: 0.8rem;
`;

const LikeBtn = styled.div`
  background-color: bisque;
  button {
    padding: 0.8rem;
  }
`;
