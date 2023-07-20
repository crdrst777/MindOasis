import { useState } from "react";
import { styled } from "styled-components";
import SearchMap from "./Map";

const MapSection = () => {
  const [inputText, setInputText] = useState("");
  const [place, setPlace] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
      <SearchForm onSubmit={onSubmit}>
        <Search
          placeholder="검색어를 입력하세요"
          onChange={onChange}
          value={inputText}
        />
        <SearchBtn type="submit">검색</SearchBtn>
      </SearchForm>
      <SearchMap searchPlace={place} />
    </Container>
  );
};

export default MapSection;

const Container = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 5rem auto;
  /* position: relative; */
`;

const SearchForm = styled.form`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
`;
const Search = styled.input`
  border: none;
  width: 60%;
  padding: 20px 20px;
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 3px 0px;
  margin-right: 1rem;
  font-size: 0.9rem;
`;

const SearchBtn = styled.button`
  position: absolute;
  top: 1.2rem;
  right: 10rem;
  background-color: transparent;
  font-size: 0.9rem;
  box-shadow: none;
`;
