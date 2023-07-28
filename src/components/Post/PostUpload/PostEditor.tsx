import MapSection from "../../Map/MapSection";
import { styled } from "styled-components";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../../../fbase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { setPlaceInfo } from "../../../store/placeInfoSlice";
import { PostType } from "../../../types/types";

interface PostEditorProps {}

const PostEditor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<any>(""); // 사진 첨부 없이 텍스트만 업로드하고 싶을 때도 있으므로 기본 값을 ""로 해야한다. 업로드할 때 텍스트만 입력시 이미지 url ""로 비워두기 위함
  const fileInput = useRef<HTMLInputElement>(null); // 기본값으로 null을 줘야함
  const { placeInfo } = useSelector((state: RootState) => state.placeInfo);

  const uploadData = (Data: PostType) => {
    addDoc(collection(dbService, "posts"), Data);
    setTitle("");
    setText("");
    setAttachment(""); // 파일 미리보기 img src 비워주기
    fileInput.current!.value = "";
    dispatch(
      setPlaceInfo({
        placeName: "",
        placeAddr: "",
      })
    );
  };

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

    const blankPattern = /^\s+|\s+$/g; //공백만 입력된 경우

    if (placeInfo.placeAddr === "") {
      alert("지도에서 위치를 선택해주세요");
    } else if (text.replace(blankPattern, "") === "" || text === "") {
      alert("내용을 입력해주세요");

      //  title인풋에 공백만 있거나 값이 없는 경우엔 장소이름을 넣어준다.
    } else if (title.replace(blankPattern, "") === "" || title === "") {
      // setTitle(placeInfo.placeAddr); // 이 코드가 실행될때 리랜더링 되는데 이 리랜더링을 막아야 등록 버튼 눌렀을때 한번에 제출됨
      const postObj = {
        title: placeInfo.placeAddr,
        text: text,
        createdAt: Date.now(),
        creatorId: userInfo.uid,
        attachmentUrl,
        placeInfo,
      };
      await uploadData(postObj);
      alert("등록 완료");
      navigate(`/content`);
    } else {
      const postObj = {
        title: title,
        text: text,
        createdAt: Date.now(),
        creatorId: userInfo.uid,
        attachmentUrl,
        placeInfo,
      };
      await uploadData(postObj);
      alert("등록 완료");
      navigate(`/content`);
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
      <MapContainer>
        <SectionTitle>
          <span>1</span>
          <h2>지도에서 장소를 선택해주세요</h2>
        </SectionTitle>
        <MapSection />
      </MapContainer>

      <WriteContainer>
        <SectionTitle>
          <span>2</span>
          <h2>장소에 대해 알려주세요</h2>
        </SectionTitle>
        <SubTitle>제목</SubTitle>
        <TitleInput
          type="text"
          value={title}
          onChange={onTitleChange}
          maxLength={70}
          placeholder={placeInfo.placeAddr}
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
          <span>3</span>
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

const MapContainer = styled.section`
  margin-top: 1rem;
`;

const WriteContainer = styled.section`
  margin-top: 5rem;
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
  color: ${(props) => props.theme.colors.moreDarkGray};
  padding: 0 1.2rem;
  margin-bottom: 0.8rem;
  border-radius: 5px;
  border: ${(props) => props.theme.borders.gray};
`;

const TextInput = styled.textarea`
  width: 45rem;
  height: 11.4rem;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.moreDarkGray};
  padding: 1.2rem;
  border-radius: 5px;
  border: ${(props) => props.theme.borders.gray};
  line-height: 1.5rem;
  word-spacing: -0.3rem;
  resize: none;
`;

const FileContainer = styled.section`
  margin-top: 5rem;
`;

const FileInput = styled.input`
  width: 45rem;
  height: 5rem;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.moreDarkGray};
  padding: 0 1.2rem;
  border-radius: 5px;
  border: ${(props) => props.theme.borders.gray};
  cursor: pointer;
`;

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
    /* width: 5rem;
    height: 2rem; */
  }
`;
const PostBtn = styled(CancelBtn)`
  color: ${(props) => props.theme.colors.white};
  background-color: ${(props) => props.theme.colors.lightBlack};
  font-weight: 500;
  &:hover {
    background-color: ${(props) => props.theme.colors.darkGray};
  }
`;
