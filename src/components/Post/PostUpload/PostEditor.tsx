import MapSection from "../../Map/MapSection";
import { styled } from "styled-components";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../../../fbase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";

interface PostEditorProps {}

const PostEditor = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<any>(""); // 사진 첨부 없이 텍스트만 업로드하고 싶을 때도 있으므로 기본 값을 ""로 해야한다. 업로드할 때 텍스트만 입력시 이미지 url ""로 비워두기 위함
  const fileInput = useRef<HTMLInputElement>(null); // 기본값으로 null을 줘야함
  const { placeInfo } = useSelector((state: RootState) => state.placeInfo);
  const [selectedPlaceText, setSelectedPlaceText] = useState(true);

  // submit 할때마다 document를 생성
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let attachmentUrl: string = "";

    if (attachment) {
      const attachmentRef = ref(storageService, `${userInfo.uid}/${uuidv4()}`); // 파일 경로 참조 생성
      await uploadString(attachmentRef, attachment, "data_url"); // 파일 업로드(이 경우는 url)
      await getDownloadURL(attachmentRef)
        .then((url) => {
          attachmentUrl = url;
        })
        .catch((err) => {
          console.log(err);
        });
    }

    //공백만 입력된 경우
    const blankPattern = /^\s+|\s+$/g;
    if (title.replace(blankPattern, "") === "" || title === "") {
      alert("제목을 입력해주세요");
    } else if (text.replace(blankPattern, "") === "" || text === "") {
      alert("내용을 입력해주세요");
    } else if (placeInfo.placeAddr === "") {
      alert("지도에서 위치를 선택해주세요");
    } else {
      const postObj = {
        title: title,
        text: text,
        createdAt: Date.now(),
        creatorId: userInfo.uid,
        attachmentUrl,
        placeInfo,
      };

      await addDoc(collection(dbService, "posts"), postObj);
      setTitle("");
      setText("");
      setAttachment(""); // 파일 미리보기 img src 비워주기
      fileInput.current!.value = "";
      setSelectedPlaceText((prev) => !prev); // Map.tsx의 SelectedPlaceText 비활성화하기
      // navigate(`/content`);
      alert("등록 완료");
    }
  };

  const onCancelClick = () => {
    navigate(`/content`);
  };

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
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
        <SectionTitle>
          <span>1</span>
          <h2>장소에 대해 알려주세요</h2>
        </SectionTitle>
        <SubTitle>제목</SubTitle>
        <TitleInput
          type="text"
          value={title}
          onChange={onTitleChange}
          maxLength={70}
          placeholder="글 제목을 입력해주세요!"
        />

        <TextInput
          maxLength={500}
          value={text}
          onChange={onTextChange}
          placeholder="자유롭게 장소에 대해 적어주세요!"
        />
      </WriteContainer>

      <FileContainer>
        <SectionTitle>
          <span>2</span>
          <h2>사진을 공유해주세요</h2>
        </SectionTitle>
        <FileInput
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

      <MapContainer>
        <SectionTitle>
          <span>3</span>
          <h2>지도에서 장소를 선택해주세요</h2>
        </SectionTitle>
        <MapSection selectedPlaceText={selectedPlaceText} />
      </MapContainer>
      {/* <RadioContainer /> */}

      <BtnContainer>
        <CancelBtn onClick={onCancelClick}>취소</CancelBtn>
        <PostBtn onClick={onSubmit}>등록</PostBtn>
      </BtnContainer>
    </Container>
  );
};

export default PostEditor;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const WriteContainer = styled.section`
  margin-top: 3rem;
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 2.25rem;
  border-bottom: 3px solid #f2f2f2;

  span {
    margin-right: 0.5rem;
    width: 1.75rem;
    height: 1.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: ${(props) => props.theme.colors.mint};
    font-size: 1rem;
    font-weight: 700;
    color: ${(props) => props.theme.colors.white};
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
  }
`;

const SubTitle = styled.div`
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 5px;
  color: ${(props) => props.theme.colors.darkGray};
`;

const TitleInput = styled.input`
  width: 45rem;
  min-height: 3.5rem;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.darkGray};
  padding: 0 1.2rem;
  margin-bottom: 0.8rem;
  border-radius: 5px;
  border: ${(props) => props.theme.borders.gray};
`;

const TextInput = styled.textarea`
  width: 45rem;
  height: 11.4rem;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.darkGray};
  padding: 1.2rem;
  border-radius: 5px;
  border: ${(props) => props.theme.borders.gray};
  line-height: 1.5rem;
  word-spacing: -0.3rem;
  resize: none;
`;

const FileContainer = styled(WriteContainer)`
  margin-top: 5rem;
`;

const FileInput = styled.input`
  width: 45rem;
  height: 5rem;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.darkGray};
  padding: 0 1.2rem;
  border-radius: 5px;
  border: ${(props) => props.theme.borders.gray};
  cursor: pointer;
`;

const MapContainer = styled(FileContainer)``;

const BtnContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const CancelBtn = styled.button`
  height: 2rem;
  color: black;
  background-color: ${(props) => props.theme.colors.moreLightGray};
  border-radius: 4px;
  margin: 2.5rem 0.5rem;
  padding: 0 1.25rem;
  font-size: 1rem;
  font-weight: 400;

  @media ${(props) => props.theme.mobile} {
    width: 5rem;
    height: 2rem;
  }
`;
const PostBtn = styled(CancelBtn)`
  color: ${(props) => props.theme.colors.white};
  background-color: ${(props) => props.theme.colors.lightBlack};
  font-weight: 500;
`;
