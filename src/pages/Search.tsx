import { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { styled } from "styled-components";
import { PostType } from "../types/types";
import { useNavigate } from "react-router";
import search from "../assets/img/search-icon.png";
import {
  collection,
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setSearchedPostsReducer } from "../store/searchedPostsSlice";

const Search = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");
  const postsArr: PostType[] = [];
  const [hasResult, setHasResult] = useState(true);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 검색 결과 가져오기
    try {
      console.log("검색 왜 안돼?");

      const q = query(
        collection(dbService, "posts"),
        orderBy("placeInfo.placeAddr"), // 주소 정렬
        startAt(keyword),
        endAt(keyword + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        postsArr.push(
          (doc.id,
          "=>",
          {
            id: doc.id,
            ...doc.data(),
          })
        );
      });

      if (postsArr.length > 0) {
        dispatch(setSearchedPostsReducer(postsArr));
        navigate("/content");
      } else {
        setHasResult(false);
      }
    } catch (error: any) {
      window.confirm(error.code);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  console.log("keyword", keyword);

  return (
    <Container>
      <SearchContainer>
        <SearchForm onSubmit={onSubmit}>
          <SearchInput onChange={onChange} value={keyword} />
          <SearchBtn type="submit">
            <SearchIcon />
          </SearchBtn>
        </SearchForm>
        <Text>
          {hasResult ? (
            <h3>지역명을 입력해주세요. 예&#41; 서울 마포구</h3>
          ) : (
            <h3>검색 결과가 없습니다.</h3>
          )}
        </Text>
      </SearchContainer>
    </Container>
  );
};

export default Search;

const Container = styled.div`
  width: 100%;
  height: 38.5rem;
  display: flex;
  justify-content: center;
`;

const SearchContainer = styled.div`
  width: 37rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 8rem;
`;

const SearchForm = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  cursor: pointer;
`;

const SearchBtn = styled.button``;

const SearchIcon = styled.img.attrs({
  src: search,
})`
  position: absolute;
  width: 1.5rem;
  top: 1rem;
  right: 1.3rem;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 3.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.darkGray};
  /* background-color: #eff2f5; */
  background-color: ${(props) => props.theme.colors.lightGray};
  padding: 0.2rem 3.3rem 0 1.3rem;
  border-radius: 5px;
  /* border: none; */
  border: ${(props) => props.theme.borders.gray};

  &:hover {
    outline: 1px solid #c9c9c9;
  }
  &:focus {
    outline: 1.8px solid ${(props) => props.theme.colors.yellow};
  }
`;

const Text = styled.div`
  margin-top: 4rem;
  font-size: 1.12rem;
  font-weight: 400;
`;
