import { styled } from "styled-components";
import PostEditor from "../../components/Post/PostUpload/PostEditor";

const UploadPost = () => {
  return (
    <>
      <Container>
        <PostEditor />
      </Container>
    </>
  );
};

export default UploadPost;

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 38.7rem;
  /* flex-direction: column; */
  margin: 2.8rem auto;
`;
