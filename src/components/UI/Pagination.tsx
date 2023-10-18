import { styled } from "styled-components";
import { ReactComponent as RightArrowIcon } from "../../assets/icon/right-arrow-icon.svg";
import { ReactComponent as LeftArrowIcon } from "../../assets/icon/left-arrow-icon.svg";

interface Props {
  totalPosts: number;
  postsPerPage: number;
  currentPage: number;
  setCurrentPage: any;
}

const Pagination = ({
  totalPosts,
  postsPerPage,
  currentPage,
  setCurrentPage,
}: Props) => {
  const pageNumList: number[] = [];
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumList.push(i);
  }

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  if (totalPages === 1) {
    return null;
  }

  return (
    <Container>
      <BtnContainer>
        {pageNumList.length === 0 ? null : (
          <>
            <ArrowBtn
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              $disabled={currentPage === 1}
            >
              <LeftArrowIcon />
            </ArrowBtn>

            {pageNumList.map((page, idx) => (
              <Btn
                key={idx}
                onClick={() => setCurrentPage(page)}
                $active={currentPage === page}
              >
                {page}
              </Btn>
            ))}

            <ArrowBtn
              onClick={goToNextPage}
              disabled={currentPage === pageNumList.length}
              $disabled={currentPage === pageNumList.length}
            >
              <RightArrowIcon />
            </ArrowBtn>
          </>
        )}
      </BtnContainer>
    </Container>
  );
};

export default Pagination;

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const BtnContainer = styled.nav`
  display: flex;
  justify-content: space-between;
`;

const Btn = styled.button<{ $active: boolean }>`
  width: 2rem;
  height: 2rem;
  margin: 0 0.3rem;
  border-radius: 50%;
  font-weight: 500;
  background-color: ${(props) => props.$active && "#ffe371"};
  transition: background-color 0.25s ease;
  &:hover {
    background-color: ${(props) =>
      !props.$active && props.theme.colors.lightGray};
  }
`;

const ArrowBtn = styled.button<{ $disabled: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  margin: 0 0.3rem;
  border-radius: 50%;
  transition: background-color 0.25s ease;
  &:hover {
    background-color: ${(props) =>
      !props.$disabled && props.theme.colors.lightGray};
  }

  svg {
    width: 1.4rem;
    height: 1.4rem;
    fill: ${(props) =>
      props.$disabled ? "#9f9f9f" : props.theme.colors.black};
  }
`;
