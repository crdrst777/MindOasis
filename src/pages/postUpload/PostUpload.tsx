import { styled } from "styled-components";
import PostEditor from "../../components/Post/PostUpload/PostEditor";

interface PostUploadProps {
  userObj: any | null;
}

const PostUpload = ({ userObj }: PostUploadProps) => {
  return (
    <>
      <Container>
        <PostEditor userObj={userObj} />
      </Container>
    </>
  );
};

export default PostUpload;

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 45rem;
  /* flex-direction: column; */
  margin: 3rem auto;
`;
