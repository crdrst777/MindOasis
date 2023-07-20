import { useRef, useState } from "react";
import { dbService } from "../../../fbase";
import { storageService } from "../../../fbase";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { styled } from "styled-components";

interface UploadProps {
  userObj: any | null;
}

const Upload = ({ userObj }: UploadProps) => {
  const [title, setTitle] = useState("");
  const [attachment, setAttachment] = useState<any>("");
  // 사진 첨부 없이 텍스트만 트윗하고 싶을 때도 있으므로 기본 값을 ""로 해야한다. 트윗할 때 텍스트만 입력시 이미지 url ""로 비워두기 위함
  const fileInput = useRef<HTMLInputElement>(null); // 기본값으로 null을 줘야함

  // submit 할때마다 document를 생성
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let attachmentUrl: string = "";

    if (attachment) {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`); // 파일 경로 참조 생성
      await uploadString(attachmentRef, attachment, "data_url"); // 파일 업로드(이 경우는 url)
      await getDownloadURL(attachmentRef)
        .then((url) => {
          attachmentUrl = url;
        })
        .catch((err) => {
          console.log(err);
        });
    }
    const postObj = {
      title: title,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    await addDoc(collection(dbService, "posts"), postObj);
    setTitle("");
    setAttachment(""); //파일 미리보기 img src 비워주기
    fileInput.current!.value = "";
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const theFile = e.currentTarget.files![0];
    console.log(theFile);
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      console.log("finishedEvent", finishedEvent);
      setAttachment(reader.result);
    }; // 파일을 다 읽으면 finishedEvent를 받는다.
    reader.readAsDataURL(theFile); // 그 다음 데이터를 얻는다.
  };

  const onClearAttachment = () => {
    setAttachment("");
    fileInput.current!.value = ""; // 사진을 선택했다가 clear를 눌렀을때, 선택된 파일명을 지워줌.
  };

  return (
    <Container>
      <WriteContainer>
        <SubTitle>제목</SubTitle>

        <TitleInput
          type="text"
          value={title}
          onChange={onChange}
          maxLength={120}
          placeholder="글 제목을 입력해주세요!"
        />

        <TextInput />
      </WriteContainer>

      <FileContainer>
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        {attachment && (
          <>
            <img src={attachment} width="50px" height="50px" alt="preview" />
            <button onClick={onClearAttachment}>Clear</button>
          </>
        )}
      </FileContainer>

      <BtnDiv>
        <CancelBtn>취소</CancelBtn>
        <PostBtn onClick={onSubmit}>등록</PostBtn>
      </BtnDiv>
    </Container>
  );
};

export default Upload;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const WriteContainer = styled.section`
  margin-top: 5rem;
`;

const SubTitle = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.darkGray};
  margin: 0 0 5px;
`;

const TitleInput = styled.input`
  width: 45rem;
  min-height: 3.5rem;
  font-size: 1rem;
  font-weight: 500;
  padding: 0 3.25rem 0 1rem;
  margin-bottom: 1rem;
  border-radius: 5px;
  border: ${(props) => props.theme.borders.gray};
`;

const TextInput = styled.input`
  width: 45rem;
  min-height: 10rem;
  font-size: 1rem;
  font-weight: 500;
  padding: 0 3.25rem 0 1rem;
  border-radius: 5px;
  border: ${(props) => props.theme.borders.gray};
`;

const FileContainer = styled.section`
  margin-top: 5rem;
`;

const BtnDiv = styled.div`
  display: flex;
  justify-content: center;
`;
const CancelBtn = styled.button`
  width: 8.44rem;
  height: 3.125rem;
  color: black;
  border-radius: 10px;
  margin: 2.5rem 0.5rem;
  font-size: 0.9rem;

  @media ${(props) => props.theme.mobile} {
    width: 5rem;
    height: 2rem;
  }
`;
const PostBtn = styled(CancelBtn)`
  /* background-color: ${(props) => props.theme.primary}; */
`;
