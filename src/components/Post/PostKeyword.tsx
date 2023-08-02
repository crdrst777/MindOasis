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
  margin-top: 0.5rem;
  margin-bottom: 1.7rem;
`;

const Keyword = styled.div`
  display: flex;
  align-items: center;
  height: 1.625rem;
  color: ${(props) => props.theme.colors.darkGray};
  background-color: #c7dbf5;
  border-radius: 2px;
  padding: 0 0.5rem;
  margin-right: 0.5rem;
  font-size: 0.9rem;
  font-weight: 400;
`;
