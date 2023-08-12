import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { dbService } from "../../fbase";
import { useEffect, useState } from "react";
import { PostType } from "../../types/types";
import { styled } from "styled-components";

interface Props {
  post: PostType;
}

const MyPostsList = ({ post }: Props) => {
  const createdAt = post.createdAt;
  const timestamp = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(createdAt);

  return (
    <Container>
      <MyPostContainer key={post.id}>
        <Img src={post.attachmentUrl} alt="image" />
        <Title>{post.title}</Title>
        <CreatedAt>{timestamp}</CreatedAt>
      </MyPostContainer>
    </Container>
  );
};

export default MyPostsList;

const Container = styled.div`
  width: 100%;
`;

const MyPostContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 1.6rem;
  cursor: pointer;
  padding: 1rem;
  border-radius: 0.5rem;
  /* box-shadow: 0 8px 16px #00000019; */
  box-shadow: rgba(0, 0, 0, 0.089) 0px 0px 15px 0px;
  /* transition: all 0.5s ease 0s; */
  transition: box-shadow 0.4s ease 0s;

  &:hover {
    /* box-shadow: 0 8px 16px #00000038; */
    box-shadow: rgba(0, 0, 0, 0.22) 0px 0px 15px 0px;
  }

  /* background-color: lightblue; */
`;

const Img = styled.img`
  width: 5rem;
  height: 5rem;
  object-fit: cover;
  border-radius: 4px;
`;

const Title = styled.div`
  width: 22rem;
  display: flex;
  align-items: center;
  font-weight: 400;
  padding: 1rem;
`;

const CreatedAt = styled.div`
  color: ${(props) => props.theme.colors.gray};
  font-size: 0.9rem;
`;
