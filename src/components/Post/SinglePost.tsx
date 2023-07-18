import { styled } from "styled-components";
import IPostType from "../../types/types";
import Modal from "../UI/Modal";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";

interface SinglePostProps {
  post: IPostType;
  isOwner: boolean;
}

const SinglePost = ({ post, isOwner }: SinglePostProps) => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하면 url을 왔다갔다할 수 있음.
  const bigMatch: PathMatch<string> | null = useMatch(`content/detail/:id`);

  const onPostClick = () => {
    navigate(`/content/detail/${post.id}`); // 이 url로 바꿔줌.
  };

  return (
    <Container>
      <SinglePostContainer onClick={onPostClick}>
        {post.attachmentUrl && (
          <PreviewImg src={post.attachmentUrl} alt="image" />
        )}
        <div>{post?.text}</div>
      </SinglePostContainer>
      {bigMatch ? (
        <Modal
          post={post}
          postId={bigMatch?.params.id}
          isOwner={isOwner}
        ></Modal>
      ) : null}
    </Container>
  );
};

export default SinglePost;

const Container = styled.div`
  display: inline-block;
  margin: 1.3rem;
  /* width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center; */
`;

const SinglePostContainer = styled.div``;

const PreviewImg = styled.img`
  width: 17rem;
  height: 17rem;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 3px 0px;
`;
