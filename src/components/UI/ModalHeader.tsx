import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { PostType, UserDocType } from "../../types/types";
import { doc, getDoc } from "firebase/firestore";
import { dbService } from "../../fbase";
import PostLike from "../Post/PostLike";
import { ReactComponent as BasicAvatarIcon } from "../../assets/icon/avatar-icon.svg";
import ModalDropdown from "./Dropdown/ModalDropdown";

interface Props {
  post: PostType;
  postId: string;
  userData: UserDocType;
}

const ModalHeader = ({ post, postId, userData }: Props) => {
  // `${post.creatorId}` ->  users db의 documentId와 동일. documentId로 해당 user 데이터 찾기
  const creatorDocRef = doc(dbService, "users", `${post.creatorId}`); // 게시물 작성자를 가리키는 참조 생성
  const [creatorData, setCreatorData] = useState<any>({});
  const [isLoggedIn, setIsLoggedIn] = useState(true);

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
  }, [post, postId, userData]);

  useEffect(() => {
    if (Object.keys(userData).length === 0) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [userData]);

  return (
    <Header>
      <UserInfo>
        <AvatarContainer>
          {creatorData.photoURL ? (
            <img src={creatorData.photoURL} alt="profile photo" />
          ) : (
            <BasicAvatarIconWrapper>
              <BasicAvatarIcon />
            </BasicAvatarIconWrapper>
          )}
        </AvatarContainer>
        <Nickname>{creatorData.displayName}</Nickname>
      </UserInfo>

      {isLoggedIn && (
        <>
          {post.creatorId === userData.uid ? (
            <>
              <BtnContainer>
                <PostLike post={post} postId={postId} userData={userData} />
                <ModalDropdown post={post} postId={postId}></ModalDropdown>
              </BtnContainer>
            </>
          ) : (
            <PostLike post={post} postId={postId} userData={userData} />
          )}
        </>
      )}
    </Header>
  );
};

export default ModalHeader;

const Header = styled.header`
  height: 3.85rem;
  padding: 0.6rem 1.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const AvatarContainer = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;

  img {
    width: 2.5rem;
    height: 2.5rem;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const BasicAvatarIconWrapper = styled.div`
  svg {
    width: 2.5rem;
    height: 2.5rem;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const Nickname = styled.div`
  color: ${(props) => props.theme.colors.black};
  font-size: 1.07rem;
  font-weight: 500;
  margin-left: 0.8rem;
`;

const BtnContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
