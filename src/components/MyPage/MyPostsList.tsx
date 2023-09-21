import { PostType } from "../../types/types";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";

interface Props {
  post: PostType;
}

const MyPostsList = ({ post }: Props) => {
  const navigate = useNavigate();
  const createdAt = post.createdAt;
  const timestamp = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(createdAt);

  const onPostClick = () => {
    navigate(`/mypage/content/${post.id}`); // MyPageSinglePost.tsx 가 열림
  };

  return (
    <Container>
      {post ? (
        <MyPostContainer onClick={onPostClick}>
          <Img src={post.attachmentUrl} alt="image" />
          <Title>{post.title}</Title>
          <CreatedAt>{timestamp}</CreatedAt>
        </MyPostContainer>
      ) : null}
    </Container>
  );
};

export default MyPostsList;

const Container = styled.div`
  width: 100%;
`;

const MyPostContainer = styled.div`
  max-height: 8rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  cursor: pointer;
  padding: 0.95rem;
  /* border-radius: 0.5rem; */
  border-left: 4px solid ${(props) => props.theme.colors.yellow};
  /* box-shadow: 0 8px 16px #00000019; */
  box-shadow: rgba(0, 0, 0, 0.089) 0px 0px 15px 0px;
  /* transition: all 0.5s ease 0s; */
  transition: box-shadow 0.3s ease 0s;

  &:hover {
    /* box-shadow: 0 8px 16px #00000038; */
    box-shadow: rgba(0, 0, 0, 0.223) 0px 0px 15px 0px;
  }
`;

const Img = styled.img`
  width: 4.46rem;
  height: 4.46rem;
  object-fit: cover;
  border-radius: 4px;
`;

const Title = styled.div`
  width: 19rem;
  display: flex;
  align-items: center;
  font-size: 0.96rem;
  font-weight: 400;
  padding: 0.8rem;
`;

const CreatedAt = styled.div`
  color: ${(props) => props.theme.colors.gray};
  font-size: 0.8rem;
`;
