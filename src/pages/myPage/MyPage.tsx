import { useNavigate } from "react-router-dom";
import { authService } from "../../fbase";

const MyPage = () => {
  const navigate = useNavigate();

  const onLogOutClick = async () => {
    await authService.signOut();
    navigate("/");
  };
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default MyPage;
