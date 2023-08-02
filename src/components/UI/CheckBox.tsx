import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { styled } from "styled-components";
import { setPlaceKeyword } from "../../store/checkedListSlice";

const checkBoxList = [
  "자연",
  "도시",
  "뷰가 좋은",
  "인적이 드문",
  "예시1",
  "예시2",
  "예시3",
];

const CheckBox = () => {
  const dispatch = useDispatch();
  // checkBoxList 배열 중 check된 요소가 담기는 배열
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);

  // input을 클릭했을때 checkedList라는 useState 배열에 해당 element가 포함되어있지 않다면 추가하고,
  // checkedList 배열에 이미 포함되어 있다면 해당 배열에서 제거하는 함수
  const checkedItemHandler = (value: string, isChecked: boolean) => {
    if (isChecked) {
      setCheckedList((prev) => [...prev, value]);
    } else if (!isChecked && checkedList.includes(value)) {
      setCheckedList(checkedList.filter((item) => item !== value));
    }
  };

  // input을 클릭했을때 실행되는 함수
  const checkHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    setIsChecked((prev) => !prev);
    checkedItemHandler(value, e.target.checked);
  };

  // const onSubmit = useCallback(
  //   (e: React.MouseEvent<HTMLButtonElement>) => {
  //     e.preventDefault();

  //     console.log("checkedList", checkedList);
  //   },
  //   [checkedList]
  // );

  dispatch(setPlaceKeyword(checkedList));

  return (
    <Container>
      {checkBoxList.map((item, idx) => (
        <CheckBoxWrapper key={idx}>
          <CheckBoxInput
            type="checkbox"
            id={item}
            // Array.prototype.includes() -> 내부에 해당 요소(element)가 존재할 경우 true를 반환
            checked={checkedList.includes(item)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              checkHandler(e, item)
            }
          />
          <label htmlFor={item}>{item}</label>
        </CheckBoxWrapper>
      ))}
      {/* <button onClick={onSubmit}>submit</button> */}
    </Container>
  );
};

export default CheckBox;

const Container = styled.div`
  width: 100%;
  height: 5rem;
  /* background-color: aquamarine; */
  display: flex;
  justify-content: space-between;
  /* align-items: center; */
`;

const CheckBoxWrapper = styled.div`
  /* background-color: beige; */
  margin: 0.3rem;
  padding: 0.5rem;
`;

const CheckBoxInput = styled.input``;
