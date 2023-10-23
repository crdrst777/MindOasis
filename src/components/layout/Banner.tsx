import { styled } from "styled-components";

const Banner = () => {
  return (
    <Container>
      <BannerWrapper>
        <LeftCover>
          <TextContainer>
            <Title>당신의 영감과 휴식의 공간을 공유하고 함께 탐구하세요</Title>
            <TextWrapper>
              <Text>지도로 더 정확하게 찾아가세요 🔍</Text>
              <Text>사진과 글로 장소를 공유해주세요 📸</Text>
            </TextWrapper>
          </TextContainer>
        </LeftCover>
        <RightCover>
          {/* <div>🏝</div> */}
          <div>🏞</div>
        </RightCover>
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
  height: 100%;
  flex-grow: 1.5;
  flex-shrink: 1;
  flex-basis: 0%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;
`;

const TextContainer = styled.div``;

const Title = styled.h2`
  max-width: 40rem;
  font-size: 1.75rem;
  font-weight: 600;
  line-height: 2.3rem;
`;

const TextWrapper = styled.div`
  display: flex;
  margin-top: 0.45rem;
`;

const Text = styled.span`
  margin-right: 1rem;
  font-size: 1.17rem;
  font-weight: 400;
`;

const RightCover = styled.div`
  height: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
  margin: auto;

  div {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 8rem;
  }
`;
