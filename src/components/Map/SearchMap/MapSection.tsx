import { useState } from "react";
import { styled } from "styled-components";
import search from "../../../assets/img/search-icon.png";
import SearchMap from "./Map";

const MapSection = () => {
  const [inputText, setInputText] = useState("");
  const [place, setPlace] = useState("");

  const onSubmit = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    setPlace(inputText);
    setInputText("");
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.currentTarget.value);
  };

  console.log("place", place);

  return (
    <Container>
      <SearchForm>
        <SearchIcon onClick={onSubmit} />
        <Search
          placeholder="검색어를 입력하세요"
          onChange={onChange}
          value={inputText}
        />
        {/* <SearchBtn type="submit">검색</SearchBtn> */}
      </SearchForm>
      <SearchMap searchPlace={place} />
    </Container>
  );
};

export default MapSection;

const Container = styled.div``;

const SearchForm = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
`;

const SearchIcon = styled.img.attrs({
  src: search,
})`
  position: absolute;
  width: 1.4rem;
  top: 1.1rem;
  left: 1rem;
  /* cursor: pointer; */
`;

const Search = styled.input`
  width: 45rem;
  min-height: 3.5rem;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.darkGray};
  padding: 0 3.3rem;
  border-radius: 5px;
  border: ${(props) => props.theme.borders.gray};
`;
