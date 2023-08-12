import { styled } from "styled-components";
import Sidebar from "../../components/MyPage/Sidebar";

interface Props {}

const UpdatePasswordPage = () => {
  return (
    <MyPageContainer>
      <Container>
        <Sidebar />
        <MainContainer />
      </Container>
    </MyPageContainer>
  );
};

export default UpdatePasswordPage;

const MyPageContainer = styled.div`
  background-color: ${(props) => props.theme.colors.backgroundGray};
`;
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 1080px;
  margin: auto;
  padding: 5rem 0 7rem 0;
`;

const MainContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 800px;
  min-height: 40rem;
  padding: 2.5rem;
  border: 1px solid ${(props) => props.theme.colors.borderGray};
  border-radius: 0.4rem;
  background-color: ${(props) => props.theme.colors.white};
`;
