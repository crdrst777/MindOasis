import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "../../fbase";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

interface MyPageProps {
  userObj: any | null;
}

const MyPage = ({ userObj }: MyPageProps) => {
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState<string>(
    userObj.displayName
  );

  const onLogOutClick = async () => {
    await authService.signOut();
    navigate("/");
  };

  const getMyPosts = async () => {
    // dbService의 컬렉션 중 "posts" Docs에서 userObj의 uid와 동일한 creatorID를 가진 모든 문서를 내림차순으로 가져오는 쿼리(요청) 생성
    const q = query(
      collection(dbService, "posts"),
      where("creatorId", "==", userObj.uid), // where -> 필터링하는 방법을 알려줌
      orderBy("createdAt", "desc")
    );
    // getDocs()메서드로 쿼리 결과 값 가져오기
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDisplayName(e.currentTarget.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // input창에 뭐라도 쓴 경우만 업데이트 해줌
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(userObj, {
        displayName: newDisplayName,
      });
    }
    console.log(userObj.displayName);
  };

  useEffect(() => {
    getMyPosts();
  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={newDisplayName}
          onChange={onChange}
          placeholder="Display name"
        />
        <input type="submit" value="Update Profile" />
      </form>

      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default MyPage;
