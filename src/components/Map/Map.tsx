import { useEffect, useState } from "react";
import { styled } from "styled-components";

const { kakao }: any = window;

const Map = () => {
  const [inputText, setInputText] = useState("");
  const [place, setPlace] = useState("");

  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);
    console.log("loading kakaomap");
  }, []);

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

      <BasicMap>
        <div id="map"></div>
      </BasicMap>
    </Container>
  );
};

export default Map;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
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
`;

const SearchBtn = styled.button`
  position: absolute;
  top: 1.2rem;
  right: 10rem;
  border: none;
  background-color: transparent;
`;

const BasicMap = styled.div`
  #map {
    width: 40rem;
    height: 20rem;
  }
`;
