import { useEffect, useState } from "react";

const useValid = (changeValue: any) => {
  const [validText, setValidText] = useState("");
  const [isValid, setIsValid] = useState({
    isEmail: false,
    isNickname: false,
    isPassword: false,
  });

  useEffect(() => {
    const exp = /^[a-zA-z0-9]{2,10}$/;

    if (!exp.test(changeValue.nickname)) {
      setValidText("2-10사이 대소문자 또는 숫자만 입력해 주세요.");
      setIsValid({ ...isValid, isNickname: false });
    } else {
      setValidText("");
      setIsValid({ ...isValid, isNickname: true });
    }
  }, [changeValue.nickname]);
};

export default useValid;
