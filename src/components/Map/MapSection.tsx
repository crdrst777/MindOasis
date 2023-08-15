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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.currentTarget.value);
  };

  const handleOnKeyPress = () => {
    setPlace(inputText);
    setInputText("");
  };

  console.log("placeAddr", placeAddr);

  return (
    <Container>
      <SearchForm>
        <SearchIcon />
        <Search
          placeholder="검색어를 입력하세요"
          onChange={onChange}
          value={inputText}
          onKeyPress={handleOnKeyPress}
        />
        {/* <SearchBtn onClick={onSubmit}>검색</SearchBtn> */}
      </SearchForm>
      <SearchMap searchPlace={place} />
    </Container>
  );
};

export default MapSection;

const Container = styled.div`
  width: 38.7rem;
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

const Search = styled.input`
  width: 100%;
  height: 3.3rem;
  font-size: 0.95rem;
  color: ${(props) => props.theme.colors.darkGray};
  /* background-color: #eff2f5; */
  background-color: ${(props) => props.theme.colors.lightGray};
  padding: 0 3.3rem;
  border-radius: 5px;
  border: 0px solid black;
  /* border: ${(props) => props.theme.borders.gray}; */

  &:hover {
    outline: 1px solid #c9c9c9;
  }
  &:focus {
    outline: 1.8px solid ${(props) => props.theme.colors.yellow};
  }
`;

const SearchBtn = styled.button``;
