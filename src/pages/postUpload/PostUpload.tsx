import { styled } from "styled-components";
import Upload from "../../components/Post/PostUpload/Upload";
import MapSection from "../../components/Map/SearchMap/MapSection";

interface PostUploadProps {
  userObj: any | null;
}

const PostUpload = ({ userObj }: PostUploadProps) => {
  return (
    <>
      <Container>
        <Upload userObj={userObj} />
        <MapSection />
      </Container>
    </>
  );
};

export default PostUpload;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  margin: 3rem;
`;
