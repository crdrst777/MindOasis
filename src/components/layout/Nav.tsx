import { Link } from "react-router-dom";

interface NavProps {
  userObj: any | null;
}

const Nav = ({ userObj }: NavProps) => {
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
          <Link to="/mypage">{userObj.displayName}</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
