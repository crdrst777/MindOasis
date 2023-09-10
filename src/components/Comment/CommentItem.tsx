import { styled } from "styled-components";
import { CommentType } from "../../types/types";
import avatar from "../../assets/img/avatar-icon.png";

interface Props {
  comment?: CommentType;
}

const CommentItem = ({ comment }: Props) => {
  const timestamp = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(comment.createdAt);

  return (
    <>
      <Container>
        {comment && (
          <>
            <CommentHeader>
              <AvatarWrapper>
                {comment.userPhotoURL ? (
                  <img src={comment.userPhotoURL} alt="profile" />
                ) : (
                  <BasicAvatarIcon />
                )}
              </AvatarWrapper>
              <Info>
                <Nickname>{comment.userDisplayName}</Nickname>
                <RegisteredDate>{timestamp}</RegisteredDate>
              </Info>
            </CommentHeader>

            <CommentText>
              <p>{comment.text}</p>
            </CommentText>
          </>
        )}
      </Container>
    </>
  );
};

export default CommentItem;

const Container = styled.li`
  padding: 1.3rem 0;
  border-bottom: 2px solid #e1e1e1;
`;

const CommentHeader = styled.div`
  display: flex;
  margin-bottom: 1.3rem;
`;

const AvatarWrapper = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin-right: 1rem;

  img {
    width: 2.5rem;
    height: 2.5rem;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const BasicAvatarIcon = styled.img.attrs({
  src: avatar,
})`
  width: 2.5rem;
  height: 2.5rem;
  object-fit: cover;
  border-radius: 50%;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Nickname = styled.div`
  font-weight: 600;
  margin-top: 0.1rem;
`;
const RegisteredDate = styled.div`
  font-size: 0.88rem;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: ${(props) => props.theme.colors.gray1};
  margin-top: 0.1rem;
`;

const CommentText = styled.div`
  p {
    font-size: 1.01rem;
    font-weight: 400;
    line-height: 1.55rem;
  }
`;
