import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { PostType } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { dbService } from "../../fbase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface PreviewPostProps {
  post: PostType;
}

const PreviewPost = ({ post }: PreviewPostProps) => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하면 url을 왔다갔다할 수 있음.
  // const postDocRef = doc(dbService, "posts", `${post.id}`); // 현재 게시물을 가리키는 참조 생성
  // const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // // const [isLiked, setIsLiked] = useState(false);
  // const userDocRef = doc(dbService, "users", `${userInfo.uid}`); // 현재 로그인한 유저를 가리키는 참조 생성
  // const [user, setUser] = useState<any>({});

  const openModal = (id: any) => {
    navigate(`/content/detail/${id}`); // 이 url로 바꿔줌.
  };

  // const getUser = async () => {
  //   try {
  //     const userDocSnap = await getDoc(userDocRef);
  //     if (userDocSnap.exists()) {
  //       setUser(userDocSnap.data());
  //     } else {
  //       console.log("User document does not exist");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const test = async () => {
  //   if (user.myLikes) {
  //     const likePostsArr = user.myLikes.filter(
  //       (item: string) => item === post.id
  //     );
  //     if (likePostsArr.length !== 0) {
  //       await updateDoc(postDocRef, {
  //         likeState: true,
  //       });
  //     }
  //     console.log("likeState");
  //   } else {
  //     console.log("fail");
  //   }
  // };

  // useEffect(() => {
  //   getUser();
  // }, [post]);

  // console.log("post", post);

  return (
    <Container onClick={() => openModal(post.id)}>
      <Overlay>
        <Title>{post?.title}</Title>
      </Overlay>
      {/* {post.attachmentUrl && ( */}
      <PreviewImg src={post.attachmentUrl} alt="image" />
      {/* )} */}
    </Container>
  );
};

export default PreviewPost;

const Container = styled.div`
  width: 17rem;
  height: 17rem;
  cursor: pointer;
`;

const Overlay = styled.div`
  opacity: 0;
  width: 17rem;
  height: 17rem;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.184);
  /* z-index: 2000; */
  transition: opacity 0.2s ease;
  border-radius: 4px;

  &:hover {
    opacity: 1;
    box-shadow: inset 0 2px 45px rgba(0, 0, 0, 0.209);
  }
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  /* box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 3px 0px; */
  object-fit: cover;
  border-radius: 4px;
`;

const Title = styled.div`
  display: inline-block;
  width: 11rem;
  height: 2.7rem;
  overflow: hidden;
  color: ${(props) => props.theme.colors.white};
  margin-top: 11.5rem;
  margin-left: 2rem;
  font-size: 1.02rem;
  line-height: 1.3rem;
`;
