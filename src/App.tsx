import { BrowserRouter } from "react-router-dom";
import { authService } from "./fbase";
import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import AppRouter from "./Router";
import Footer from "./components/Layout/Footer";
import { UserInfoType } from "./types/types";
import Nav from "./components/Layout/Nav";
import Loading from "./components/UI/Loading";
import { styled } from "styled-components";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
  // userInfo는 파이어베이스에서 getFirestore.currentUser.[ 필요한키 ] 이렇게 가져올 수 있는 데이터이지만, userInfo라는 변수를 만들어 속성에 넣고 여기저기서 전달받아 사용하는 이유는 소스를 통합하여 확장성 있게 사용하고 싶기 때문이다.
  // userInfo 하나만 변경해도 통합되어 변경되기 때문에 더 직관적으로 변경,저장하기 쉬워진다.

  useEffect(() => {
    setLoading(true);
    authService.onAuthStateChanged(async (user) => {
      // 여기서 받아오는 user는 authService.currentUser 와 같음. 이걸 userInfo에 넣어준다.
      if (user) {
        setIsLoggedIn(true);

        // 새 유저가 로그인할때마다 userInfo에 저장.
        // 내가 원하는 firebase의 특정 부분만을 가져와서 리액트한테 주기.
        setUserInfo({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName, // 초기값이 null임
          photoURL: user.photoURL, // 초기값이 null임
        });

        // 어째선지 Social Login을 했을때는 displayName이 존재하지만, Local Login을 했을때는 displayName이 null이다. 그래서 아래 코드를 씀.
        // if (user.displayName === null) {
        //   const userName = user.email!.split("@")[0]; // @ 앞의 부분만 가져옴
        //   await updateProfile(user, { displayName: userName });
        // }
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
      setInit(true); // init이 false라면 router를 숨길거임. true일때 나타나게.
    });
  }, []);

  // user를 새로고침하는 기능. firebase의 정보를 가지고 리액트를 업데이트 해주기. 그래야 유저 이름 수정했을때 nav의 유저 이름도 자동으로 바뀜.
  const refreshUser = () => {
    // setUserInfo(authService.currentUser);
    // 위와 같이 하면 authService.currentUser가 너무 큰 obj라 리액트가 어떤 부분이 바뀌었는지 판단하기 어려워서 setUserInfo() 이 코드가 실행 안됨. -> 아래처럼 쪼개준다.
    const user = authService.currentUser;
    setUserInfo({
      uid: user!.uid,
      email: user!.email,
      displayName: user!.displayName,
      photoURL: user!.photoURL,
    });
  };

  localStorage.setItem("userInfo", JSON.stringify(userInfo));

  console.log("userInfo", userInfo);

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Nav />
      <ContentWrapper>
        {loading ? (
          <LoadingWrapper>
            <Loading />
          </LoadingWrapper>
        ) : null}
        {init && (
          <AppRouter isLoggedIn={Boolean(userInfo)} refreshUser={refreshUser} />
        )}
      </ContentWrapper>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

const ContentWrapper = styled.div`
  min-height: calc(100vh - 10.8rem); /* footer 높이를 빼준다. */
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 38.5rem;
`;
