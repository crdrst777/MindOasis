import { BeatLoader } from "react-spinners";
import { styled } from "styled-components";

const Loading = () => {
  return (
    <Container>
      <LoadingWrapper>
        <h3>잠시만 기다려주세요.</h3>
        <BeatLoader color={"#ffcd00"} />
      </LoadingWrapper>
    </Container>
  );
};

export default Loading;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: rebeccapurple; */
`;

// +1.5rem

const LoadingWrapper = styled.div`
  flex-direction: column;
  text-align: center;

  h3 {
    margin-bottom: 0.65rem;
    font-size: 1.1rem;
  }
`;
