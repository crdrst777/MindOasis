// 페이지 이탈 시 경고창 띄우는 로직
// 뒤로가기 할때는 해당 안됨

import { useContext, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";
import { setPlaceInfoReducer } from "../store/placeInfoSlice";

const useBlocker = (blocker: () => {}, when: boolean): void => {
  const dispatch = useDispatch();
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (when === false) return;

    const push = navigator.push;

    navigator.push = (...args: Parameters<typeof push>) => {
      const result = blocker();

      // "현재 페이지를 벗어나시겠습니까?"라는 알림창에 확인 버튼을 눌렀을 경우
      if (result !== false) {
        push(...args);

        // 글 작성 페이지(PostEditor.tsx)에서 이탈시, 유저가 선택했던 주소값을 초기화해준다. 그래야 다시 이 페이지를 열었을때 안떠있음.
        dispatch(
          setPlaceInfoReducer({
            placeName: "",
            placeAddr: "",
          })
        );
      }
    };

    return () => {
      navigator.push = push;
    };
  }, [navigator, blocker, when]);
};

export const usePrompt = (message: string, when: boolean) => {
  // 사이트를 새로고침하시겠습니까? 묻는 알림창이 뜸
  useEffect(() => {
    if (when) {
      window.onbeforeunload = function () {
        return message;
      };
    }

    return () => {
      window.onbeforeunload = null;
    };
  }, [message, when]);

  // useCallback 은 useMemo 를 기반으로 만들어졌습니다. 다만, 함수를 위해서 사용 할 때 더욱 편하게 해준 것 뿐임.
  // useCallback 을 사용 함으로써, 바로 이뤄낼수 있는 눈에 띄는 최적화는 없음. 컴포넌트 렌더링 최적화 작업을 해주어야만 성능이 최적화됨.
  const blocker = useCallback(() => {
    const confirm: boolean = window.confirm(message);
    return confirm;
  }, [message]);

  useBlocker(blocker, when);
};
