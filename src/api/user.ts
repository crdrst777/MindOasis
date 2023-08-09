import { doc, getDoc } from "firebase/firestore";
import { dbService } from "../fbase";

export const getUserData = async (userId: string, setUserData: any) => {
  const userDocRef = doc(dbService, "users", `${userId}`); // 현재 로그인한 유저를 가리키는 참조 생성
  try {
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      setUserData(userDocSnap.data());
    } else {
      console.log("User document does not exist");
    }
  } catch (err) {
    console.log(err);
  }
};
