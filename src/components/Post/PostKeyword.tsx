import { styled } from "styled-components";

interface Props {
  placeKeyword: string[];
}

const PostKeyword = ({ placeKeyword }: Props) => {
  return (
    <>
      {placeKeyword?.map((item, idx) => (
        <Keyword key={idx}>{item}</Keyword>
      ))}
    </>
  );
};

export default PostKeyword;

const Keyword = styled.div`
  display: flex;
  align-items: center;
  height: 1.625rem;
  color: ${(props) => props.theme.colors.darkGray};
  background-color: lightblue;
  border-radius: 2px;
  padding: 0 0.5rem;
  margin-right: 0.5rem;
  font-size: 0.9rem;
  font-weight: 400;
`;
