import { styled } from "styled-components";

interface Props {
  placeKeyword: string[];
}

const PostKeyword = ({ placeKeyword }: Props) => {
  return (
    <Container>
      {placeKeyword?.map((item, idx) => (
        <Keyword key={idx}>{item}</Keyword>
      ))}
    </Container>
  );
};

export default PostKeyword;

const Container = styled.div`
  display: flex;
  margin-top: 0.4rem;
  margin-bottom: 1.7rem;
`;

const Keyword = styled.div`
  display: flex;
  align-items: center;
  color: #5f5f5f;
  /* background-color: #ffe371; */
  background-color: #ffe787;
  border-radius: 1rem;
  padding: 0.5rem 0.72rem 0.41rem 0.72rem;
  margin-right: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
`;
