import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { styled } from "styled-components";
import { setPlaceKeywordReducer } from "../../store/checkedListSlice";

const checkBoxList = [
  "자연",
  "도시",
  "물",
  "산",
  "한적한",
  "뷰가 좋은",
  "포토 스팟",
];

interface Props {
  checkedListArr: string[];
}
// checkedListArr -> 수정페이지에서 기존 값을 가져오기 위해 필요한것임

const CheckBox = ({ checkedListArr }: Props) => {
  const dispatch = useDispatch();
  // checkBoxList 배열 중 check된 요소가 담기는 배열
  // 수정하는 페이지에서, 기존값에 체크되어있게 하기 위해 기존값을 넣어준다.
  const [checkedList, setCheckedList] = useState<string[]>(checkedListArr);
  const [isChecked, setIsChecked] = useState(false);

  // useEffect(() => {
  //   // 수정하는 페이지에서, 기존값에 체크되있게 하기 위해 기존값을 넣어준다.
  //   setCheckedList(checkedListArr);
  // }, []);

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

  useEffect(() => {
    dispatch(setPlaceKeywordReducer(checkedList));
  }, [dispatch, checkedList]);

  // console.log("checkedList", checkedList);

  return (
    <Container>
      {checkedList ? (
        <>
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
              <CheckBoxLabel htmlFor={item}>{item}</CheckBoxLabel>
            </CheckBoxWrapper>
          ))}
        </>
      ) : null}
    </Container>
  );
};

export default CheckBox;

const Container = styled.div`
  width: 100%;
  height: 6rem;
  display: flex;
  justify-content: space-between;
`;

const CheckBoxWrapper = styled.div`
  margin-top: 0.9rem;
`;

// 원래의 인풋을 보이지 않는것처럼 멀리 보내버리고, 체크가 되었을 경우 라벨의 배경색, 글자색을 변경
const CheckBoxInput = styled.input`
  display: none;
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;

  &:checked + label {
    background-color: ${(props) => props.theme.colors.lightYellow};
    color: ${(props) => props.theme.colors.black};
  }
`;

const CheckBoxLabel = styled.label`
  padding: 0.6rem 1rem 0.54rem 1rem;
  height: 2.25rem;
  cursor: pointer;
  border-radius: 2rem;
  background-color: ${(props) => props.theme.colors.lightGray};
  font-size: 0.85rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.black};
  transition: background-color 0.17s ease;

  &:hover {
    background-color: #fff5cf;
  }
`;
