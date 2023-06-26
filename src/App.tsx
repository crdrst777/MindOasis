import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import MyPage from "./pages/myPage/MyPage";
import { authService } from "./fbase";
import { useEffect, useState } from "react";
import SignUp from "./pages/auth/SignUp";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
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
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Home />} />
            </>
          ) : (
            <Route path="/" element={<Login />} />
          )}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      ) : (
        "Initializing..."
      )}
    </BrowserRouter>
  );
}

export default App;
