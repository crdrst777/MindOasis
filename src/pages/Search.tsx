import search from "../assets/img/search-icon.png";
import {
  collection,
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { styled } from "styled-components";
import { PostType } from "../types/types";
import { useDispatch } from "react-redux";
import { setSearchedPostsReducer } from "../store/searchedPostsSlice";
import { useNavigate } from "react-router";

const Search = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [posts, setPosts] = useState<PostType[]>([]); // 클릭한 카테고리에 해당되는 게시물들이 들어가는 배열

  const onSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const postsArr: PostType[] = [];
    // 검색 결과 가져오기
    try {
      const q = query(
        collection(dbService, "posts"),
        // orderBy("title"), // 제목 정렬
        orderBy("placeInfo.placeAddr"), // 제목 정렬
        startAt(keyword),
        endAt(keyword + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);
      console.log("querySnapshot", querySnapshot);
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
      setPosts(postsArr);
      // navigate("/content");
    } catch (error: any) {
      window.confirm(error.code);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    dispatch(setSearchedPostsReducer(posts));
  }, [dispatch, posts]);

  console.log("keyword", keyword);
  console.log("posts", posts);

  return (
    <Container>
      <SearchForm>
        <SearchIcon />
        <SearchInput
          onChange={onChange}
          value={keyword}
          onKeyPress={onSubmit}
        />
      </SearchForm>
    </Container>
  );
};

export default Search;

const Container = styled.div`
  width: 100%;
  height: 38.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SearchForm = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`;

const SearchIcon = styled.img.attrs({
  src: search,
})`
  position: absolute;
  width: 1.3rem;
  top: 1rem;
  left: 1rem;
`;

const SearchInput = styled.input`
  width: 38.7rem;
  height: 3.3rem;
  font-size: 0.95rem;
  color: ${(props) => props.theme.colors.darkGray};
  /* background-color: #eff2f5; */
  background-color: ${(props) => props.theme.colors.lightGray};
  padding: 0 3.3rem;
  border-radius: 5px;
  border: none;
  /* border: ${(props) => props.theme.borders.gray}; */

  &:hover {
    outline: 1px solid #c9c9c9;
  }
  &:focus {
    outline: 1.8px solid ${(props) => props.theme.colors.yellow};
  }
`;

// const SearchBar = styled.div`
//   width: 20rem;
//   height: 100%;
//   /* background-color: aquamarine; */
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   /* margin-right: 25rem; */
// `;

// const SearchInput = styled.input`
//   width: 18rem;
//   height: 2.7rem;
//   font-size: 0.9rem;
//   font-weight: 0.8rem;
//   color: ${(props) => props.theme.colors.moreDarkGray};
//   padding: 0 1.2rem;
//   border-radius: 5px;
//   border: none;
//   background-color: ${(props) => props.theme.colors.lightGray};

//   /* border: ${(props) => props.theme.borders.gray}; */
//   &:hover {
//     /* outline: 1px solid #c9c9c9; */
//   }
//   &:focus {
//     /* outline: 1.8px solid ${(props) => props.theme.colors.yellow}; */
//     outline: none;
//   }
// `;

// const Btn = styled.button`
//   cursor: pointer;
// `;
