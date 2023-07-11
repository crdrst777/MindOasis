import React from "react";
import UpdateProfile from "./UpdateProfile";

interface MyPageProps {
  userObj: any | null;
  refreshUser: () => any;
}

const MyPage = ({ userObj, refreshUser }: MyPageProps) => {
  return (
    <>
      <UpdateProfile userObj={userObj} refreshUser={refreshUser} />
    </>
  );
};

export default MyPage;
