import { BrowserRouter, Routes, Route } from "react-router-dom";
import { authService } from "./fbase";
import { useEffect, useState } from "react";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import MyPage from "./pages/myPage/MyPage";
import SignUp from "./pages/auth/SignUp";
import Nav from "./components/layout/Nav";
import Content from "./pages/content/Content";
import Footer from "./components/layout/Footer";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState<any | null>(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user); // 새 유저가 로그인할때마다 userObj에 저장.
      } else {
        setIsLoggedIn(false);
      }
      setInit(true); // init이 false라면 router를 숨길거임. true일때 나타나게.
    });
  }, []);

  console.log("currentUser", authService.currentUser);
  console.log("isLoggedIn", isLoggedIn);

  return (
    <BrowserRouter>
      {init ? (
        <>
          {isLoggedIn && <Nav />}
          {/* isLoggedIn이 true면 <Nav/>가 나오도록 */}
          <Routes>
            {isLoggedIn ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/mypage" element={<MyPage />} />
              </>
            ) : (
              <Route path="/" element={<Login />} />
            )}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/content" element={<Content userObj={userObj} />} />
          </Routes>
          {/* <Footer /> */}
        </>
      ) : (
        "Initializing..."
      )}
    </BrowserRouter>
  );
}

export default App;
