import { styled } from "styled-components";
import { ReactComponent as EllipsisIcon } from "../../assets/icon/ellipsis-icon.svg";
import { useState } from "react";

const DetailsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const DropdownBtnClick = () => {
    setIsOpen((prev) => !prev);
  };

  const onDeleteClick = () => {};

  const onEditClick = () => {};

  console.log(isOpen);

  return (
    <Container>
      <DropdownBtn onClick={DropdownBtnClick}>
        <EllipsisIcon />
      </DropdownBtn>
      {!isOpen ? (
        <Hidden />
      ) : (
        <DropdownList>
          <Test>
            <div></div>
            <div></div>
          </Test>
          <Ul>
            <Li onClick={onEditClick}>수정</Li>
            <Li onClick={onDeleteClick}>삭제</Li>
          </Ul>
        </DropdownList>
      )}
    </Container>
  );
};

export default DetailsDropdown;

const Container = styled.div`
  /* background-color: ${(props) => props.theme.colors.white};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.35); */
  /* z-index: 4001; */
  margin-left: 0.6rem;
`;

const DropdownBtn = styled.button`
  width: 2.6rem;
  height: 2rem;
  background-color: ${(props) => props.theme.colors.white};
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ababab;
  border-radius: 3px;
  cursor: pointer;
  transition: border-color 0.15s ease;
  &:hover {
    border-color: ${(props) => props.theme.colors.darkGray};
  }

  svg {
    width: 2.6rem;
    height: 2rem;
    padding: 0.45rem;
    fill: ${(props) => props.theme.colors.gray};
    transition: fill 0.15s ease;
    &:hover {
      fill: ${(props) => props.theme.colors.darkGray};
    }
  }
`;

const Hidden = styled.div`
  max-height: 0;
  overflow: hidden;
`;

const DropdownList = styled.div`
  width: 8rem;
  border: 1px solid #ababab;
  border-radius: 5px;
  background-color: ${(props) => props.theme.colors.white};
  box-shadow: 0 8px 16px #00000029;

  position: absolute;
  inset: auto 0px 0px auto;
  transform: translate3d(-29px, -637px, 0px);
  /* div {
    transition-duration: 200ms, 100ms;
    transition-timing-function: cubic-bezier(0.24, 0.22, 0.015, 1.56),
      ease-in-out;
    transition-delay: 0s, 0s;
    transition-property: transform, opacity;
  } */
`;

const Test = styled.div`
  position: absolute;
  left: 0px;
  transform: translate3d(106.667px, 0px, 0px);
  top: calc(100% - 1px);
`;

const Ul = styled.ul`
  height: 100%;
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Li = styled.li`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 400;
  color: ${(props) => props.theme.colors.darkGray};
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #f5f5f5;
  }
`;
