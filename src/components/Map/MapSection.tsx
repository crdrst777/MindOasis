import { useState } from "react";
import { styled } from "styled-components";
import search from "../../assets/img/search-icon.png";
import SearchMap from "./SearchMap";

interface Props {
  placeAddr: string;
}

const MapSection = ({ placeAddr }: Props) => {
  const [inputText, setInputText] = useState(placeAddr);
  const [place, setPlace] = useState(placeAddr);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPlace(inputText);
    setInputText("");
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.currentTarget.value);
  };

  console.log("placeAddr", placeAddr);

  return (
    <Container>
      <SearchForm onSubmit={onSubmit}>
        <SearchInput
          value={inputText}
          onChange={onChange}
          placeholder="검색어를 입력하세요"
        />
        <SearchBtn type="submit">
          <SearchIcon />
        </SearchBtn>
      </SearchForm>
      <SearchMap searchPlace={place} />
    </Container>
  );
};

export default MapSection;

const Container = styled.div`
  width: 38.7rem;
`;

const SearchForm = styled.form`
  display: flex;
  justify-content: center;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 3.3rem;
  font-size: 0.97rem;
  color: ${(props) => props.theme.colors.darkGray};
  background-color: ${(props) => props.theme.colors.lightGray};
  padding: 0.13rem 3.5rem 0 1.3rem;
  border-radius: 5px;
  border: none;
  &::placeholder {
    color: ${(props) => props.theme.colors.gray1};
  }
  &:hover {
    outline: 1px solid #c9c9c9;
  }
  &:focus {
    outline: 1.8px solid ${(props) => props.theme.colors.yellow};
  }
`;

const SearchBtn = styled.button``;

const SearchIcon = styled.img.attrs({
  src: search,
})`
  position: absolute;
  width: 1.3rem;
  top: 1rem;
  right: 1.3rem;
`;
