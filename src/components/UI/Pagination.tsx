import { styled } from "styled-components";

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
      {pageNumList.length === 0 ? null : (
        <>
          <button onClick={goToPrevPage} disabled={currentPage === 1}>
            prev
          </button>

          {pageNumList.map((page, idx) => (
            <Btn key={idx} onClick={() => setCurrentPage(page)}>
              {page}
            </Btn>
          ))}

          <button
            onClick={goToNextPage}
            disabled={currentPage === pageNumList.length}
          >
            next
          </button>
        </>
      )}
    </Container>
  );
};

export default Pagination;

const Container = styled.div`
  /* width: 60%; */
  /* height: 2rem; */
  /* background-color: aqua; */
  margin: 2.5rem auto 1rem;
  display: flex;
  justify-content: space-between;
`;

const Btn = styled.button`
  padding: 0.4rem 0.9rem;
  margin: 0 0.7rem;
  background-color: ${(props) => props.theme.colors.yellow};
`;
