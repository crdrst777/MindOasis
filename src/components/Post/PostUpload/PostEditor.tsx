import Upload from "./Upload";
import MapSection from "../../Map/SearchMap/MapSection";
import { styled } from "styled-components";

interface PostEditorProps {
  userObj: any | null;
}

const PostEditor = ({ userObj }: PostEditorProps) => {
  return (
    <Container>
      <PostEditorContainer>
        <Upload userObj={userObj} />
        <MapSection />
        {/* <RadioContainer /> */}
      </PostEditorContainer>
    </Container>
  );
};

export default PostEditor;

const Container = styled.div``;

const PostEditorContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;
