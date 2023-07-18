import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import UpdateProfile from "./pages/myPage/UpdateProfile";
import UpdatePassword from "./pages/myPage/UpdatePassword";
import MyPosts from "./pages/myPage/MyPosts";
import MyLikes from "./pages/myPage/MyLikes";
import SignUp from "./pages/auth/SignUp";
import Nav from "./components/Layout/Nav/Nav";
import Footer from "./components/Layout/Footer";
import Content from "./pages/content/Content";
import PostUpload from "./pages/postUpload/PostUpload";

interface AppRouterProps {
  isLoggedIn: boolean;
  userObj: any | null;
  refreshUser: () => any;
}

const AppRouter = ({ isLoggedIn, userObj, refreshUser }: AppRouterProps) => {
  return (
    <>
      {isLoggedIn && <Nav userObj={userObj} />}
      {/* isLoggedIn이 true면 <Nav/>가 나오도록 */}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route
              path="/mypage/updateprofile"
              element={
                <UpdateProfile userObj={userObj} refreshUser={refreshUser} />
              }
            />
            <Route path="/mypage/updatepassword" element={<UpdatePassword />} />
            <Route
              path="/mypage/myposts"
              element={<MyPosts userObj={userObj} />}
            />
            <Route path="/mypage/mylikes" element={<MyLikes />} />

            <Route
              path="/postupload"
              element={<PostUpload userObj={userObj} />}
            />
          </>
        ) : (
          <Route path="/" element={<Login />} />
        )}

        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/content" element={<Content userObj={userObj} />} />
      </Routes>
    </>
  );
};

export default AppRouter;
