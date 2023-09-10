import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import UpdateProfile from "./pages/myPage/UpdateProfile";
import UpdatePassword from "./pages/myPage/UpdatePassword";
import MyPosts from "./pages/myPage/MyPosts";
import MyLikes from "./pages/myPage/MyLikes";
import SignUp from "./pages/auth/SignUp";
import Content from "./pages/content/Content";
import UploadPost from "./pages/post/UploadPost";
import EditPost from "./pages/post/EditPost";
import MyPageSinglePost from "./pages/myPage/MyPageSinglePost";

interface AppRouterProps {
  isLoggedIn: boolean;
  refreshUser: () => any;
}

const AppRouter = ({ isLoggedIn, refreshUser }: AppRouterProps) => {
  return (
    <>
      {/* {isLoggedIn && <Nav />} */}
      {/* isLoggedIn이 true면 <Nav/>가 나오도록 */}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route
              path="/mypage/updateprofile"
              element={
                // <UpdateProfile userObj={userObj} refreshUser={refreshUser} />
                <UpdateProfile refreshUser={refreshUser} />
              }
            />
            <Route path="/mypage/updatepassword" element={<UpdatePassword />} />
            <Route path="/mypage/myposts" element={<MyPosts />} />
            <Route path="/mypage/mylikes" element={<MyLikes />} />

            <Route path="/uploadpost" element={<UploadPost />} />
            <Route path="/editpost" element={<EditPost />} />
          </>
        ) : (
          <Route path="/login" element={<Login />} />
        )}

        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/content" element={<Content />} />
        <Route path="/content/:id" element={<Content />} />
        <Route path="/mypage/content/:id" element={<MyPageSinglePost />} />
      </Routes>
    </>
  );
};

export default AppRouter;
