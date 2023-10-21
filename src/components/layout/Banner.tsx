import { styled } from "styled-components";

const Banner = () => {
  return (
    <Container>
      <BannerWrapper>
        <LeftCover>
          <Title>당신의 영감과 휴식의 공간을 공유하고 함께 탐구하세요</Title>
          <TextContainer>
            <Text></Text>
          </TextContainer>
        </LeftCover>
        <RightCover></RightCover>
      </BannerWrapper>
    </Container>
  );
};

export default Banner;

const Container = styled.div`
  width: 100%;
  height: 13rem;
  background-color: #ffee7f;
`;

const BannerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: 0 4rem;
`;

const LeftCover = styled.div`
  /* width: 65%; */
  height: 100%;
  flex-grow: 1.5;
  flex-shrink: 1;
  flex-basis: 0%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* margin: auto; */
  /* background-color: antiquewhite; */
`;

const Title = styled.h2`
  max-width: 20rem;
  font-size: 1.75rem;
  font-weight: 600;
  line-height: 2.3rem;
`;
const TextContainer = styled.div``;
const Text = styled.span``;

const RightCover = styled.div`
  /* width: 35%; */
  height: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
  margin: auto;
  /* background-color: tomato; */
`;
