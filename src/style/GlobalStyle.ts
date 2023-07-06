import { createGlobalStyle } from "styled-components";
import { reset } from "styled-reset";

const GlobalStyle = createGlobalStyle`
${reset}
* {
  box-sizing: border-box;
}
body {
  font-weight: 300;
  font-family: "Pretendard", serif;
  color: black;
  line-height: 1.2;
  background-color: white;
}
a {
  text-decoration: none;
  color: inherit;
  &:link,&:visited{
  color: inherit;
  }
}
button{
  cursor: pointer;
  /* border: none; 
  padding: 0; 
  margin: 0;
  background-color: transparent; */
}
li {
  list-style: none;
}
`;

export default GlobalStyle;