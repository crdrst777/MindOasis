import { styled } from "styled-components";
import PostUpload from "../../components/Post/PostUpload/PostUpload";
import MapSection from "../../components/Map/SearchMap/MapSection";

interface PostProps {
  userObj: any | null;
}

const Post = ({ userObj }: PostProps) => {
  return (
    <>
      <Container>
        <PostUpload userObj={userObj} />
        <MapSection />
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
