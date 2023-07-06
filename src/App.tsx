import { BrowserRouter, Routes, Route } from "react-router-dom";
import { authService } from "./fbase";
import { useEffect, useState } from "react";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import MyPage from "./pages/myPage/MyPage";
import SignUp from "./pages/auth/SignUp";
import Nav from "./components/Layout/Nav";
import Content from "./pages/content/Content";
import Footer from "./components/Layout/Footer";
import { updateProfile } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState<any | null>(null);

  useEffect(() => {
    authService.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user); // 새 유저가 로그인할때마다 userObj에 저장.
        // Local Login을 했을때는 displayName이 null이고, Social Login을 했을때는 displayName이 존재함; 그래서 아래의 코드를 씀
        if (user.displayName === null) {
          const userName = user.email!.split("@")[0];
          await updateProfile(user, { displayName: userName });
        }
      } else {
        setIsLoggedIn(false);
        // setUserObj(null);
      }
      setInit(true); // init이 false라면 router를 숨길거임. true일때 나타나게.
    });
  }, []);

  console.log("currentUser", authService.currentUser);
  console.log("isLoggedIn", isLoggedIn);
  console.log("userObj", userObj);

  return (
    <BrowserRouter>
      {init ? (
        <>
          {isLoggedIn && <Nav userObj={userObj} />}
          {/* isLoggedIn이 true면 <Nav/>가 나오도록 */}
          <Routes>
            {isLoggedIn ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/mypage" element={<MyPage userObj={userObj} />} />
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
