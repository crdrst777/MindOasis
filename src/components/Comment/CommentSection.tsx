import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { dbService } from "../../fbase";
import { UserDocType } from "../../types/types";
import { CommentType } from "../../types/types";
import WriteComment from "./WriteComment";
import CommentItem from "./CommentItem";

interface Props {
  userData: UserDocType;
  postId?: string;
}

const CommentSection = ({ userData, postId }: Props) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [triggerRender, setTriggerRender] = useState(false);
  const [triggerDelRender, setTriggerDelRender] = useState(false);

  const getComments = async () => {
    const commentsArr: CommentType[] = [];
    const q = query(
      collection(dbService, "comments"),
      where("postId", "==", postId), // where -> 필터링하는 방법을 알려줌
      orderBy("createdAt") // document를 글을 쓴 순서대로 차례대로 오름차순으로 정렬하기
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      commentsArr.push(
        (doc.id,
        "=>",
        {
          id: doc.id,
          ...doc.data(),
        })
      );
    });
    setComments(commentsArr);
  };

  const submitRenderingHandler = (triggerRender: boolean) => {
    setTriggerRender(triggerRender);
  };

  const delRenderingHandler = (triggerRender: boolean) => {
    setTriggerDelRender(triggerRender);
  };

  useEffect(() => {
    getComments();
  }, [userData, postId, triggerRender, triggerDelRender]);

  // console.log("triggerRender----section", triggerRender);

  return (
    <Container>
      <WriteComment
        userData={userData}
        postId={postId}
        submitRenderingHandler={submitRenderingHandler}
      />

      <CommentList>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            userId={userData.uid}
            delRenderingHandler={delRenderingHandler}
          />
        ))}
      </CommentList>
    </Container>
  );
};

export default CommentSection;

const Container = styled.section`
  height: 20rem;
  padding: 3.5rem 3.8rem 3.8rem 3.8rem;
`;

const CommentList = styled.ul`
  padding-bottom: 5rem; // comments가 있는지 조건에 따라서
`;
