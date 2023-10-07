import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import UpdateProfile from "./pages/myPage/UpdateProfile";
import UpdatePassword from "./pages/myPage/UpdatePassword";
import MyPosts from "./pages/myPage/MyPosts";
import MyLikes from "./pages/myPage/MyLikes";
import SignUp from "./pages/auth/SignUp";
import Content from "./pages/Content";
import UploadPost from "./pages/post/UploadPost";
import EditPost from "./pages/post/EditPost";
import MyPageSinglePost from "./pages/myPage/MyPageSinglePost";
import Search from "./pages/Search";
import DeleteAccount from "./pages/myPage/DeleteAccount";
import Reauthenticate from "./pages/myPage/Reauthenticate";

interface AppRouterProps {
  isLoggedIn: boolean;
  refreshUser: () => any;
}

const AppRouter = ({ isLoggedIn, refreshUser }: AppRouterProps) => {
  return (
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
          {/* <Route path="/mypage/reauthenticate" element={<Reauthenticate />} /> */}
          <Route path="/mypage/deleteaccount" element={<DeleteAccount />} />
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
      <Route path="/search" element={<Search />} />
      <Route path="/content" element={<Content />} />
      <Route path="/content/:id" element={<Content />} />
      <Route path="/mypage/content/:id" element={<MyPageSinglePost />} />
    </Routes>
  );
};

export default AppRouter;
