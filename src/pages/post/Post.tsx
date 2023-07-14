import { styled } from "styled-components";
import PostUpload from "../../components/Post/PostUpload/PostUpload";
import Map from "../../components/Map/Map";

interface PostProps {
  userObj: any | null;
}

const Post = ({ userObj }: PostProps) => {
  return (
    <>
      <Container>
        <PostUpload userObj={userObj} />
        <Map />
      </Container>
    </>
  );
};

export default Post;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  margin: 3rem;
`;
