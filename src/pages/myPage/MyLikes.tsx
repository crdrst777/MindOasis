import { styled } from "styled-components";
import MyLikesList from "../../components/MyPage/MyLikesList";
import Sidebar from "../../components/MyPage/Sidebar";

interface Props {}

const MyLikes = () => {
  return (
    <MyPageContainer>
      <Container>
        <Sidebar />
        <MainContainer>
          <MyLikesList />
        </MainContainer>
      </Container>
    </MyPageContainer>
  );
};

export default MyLikes;

const MyPageContainer = styled.div`
  background-color: ${(props) => props.theme.colors.backgroundGray};
`;
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1100px;
  height: 800px;
  margin: auto;
  padding: 6rem 0 6rem 0;
`;

const MainContainer = styled.section`
  width: 800px;
  padding: 2.5rem;
  border: 1px solid ${(props) => props.theme.colors.borderGray};
  border-radius: 0.4rem;
  background-color: ${(props) => props.theme.colors.white};
`;
