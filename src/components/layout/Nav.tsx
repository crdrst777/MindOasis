import { useState } from "react";
import { Link } from "react-router-dom";

interface NavProps {
  userObj: any | null;
}

const Nav = ({ userObj }: NavProps) => {
  // const [profilePhoto, setProfilePhoto] = useState<any>("");

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/content">Content</Link>
        </li>
        <li>
          <Link to="/mypage">
            {userObj.displayName}
            {/* <img src={profilePhoto} width="50px" height="50px" alt="preview" /> */}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
