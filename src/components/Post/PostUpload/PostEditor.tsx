import MapSection from "../../Map/MapSection";
import { styled } from "styled-components";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../../../fbase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { setPlaceInfo } from "../../../store/placeInfoSlice";
import { PostType } from "../../../types/types";
import CheckBox from "../../UI/CheckBox";
import { usePrompt } from "../../../hooks/useBlocker";
import { createBrowserHistory } from "history";
import imageCompression from "browser-image-compression";

const PostEditor = () => {
  const history = createBrowserHistory();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  // const [attachment, setAttachment] = useState<any>(""); // 사진 첨부 없이 텍스트만 업로드하고 싶을 때도 있으므로 기본 값을 ""로 해야한다. 업로드할 때 텍스트만 입력시 이미지 url ""로 비워두기 위함
  const fileInput = useRef<HTMLInputElement>(null); // 기본값으로 null을 줘야함
  const { placeInfo } = useSelector((state: RootState) => state.placeInfo);
  const { placeKeyword } = useSelector(
    (state: RootState) => state.placeKeyword
  );
  // 이미지 리사이즈
  const [imageUpload, setImageUpload] = useState(null);
  const [uploadPreview, setUploadPreview] = useState<string>("");

  const [test, setTest] = useState(true);

  // usePrompt("현재 페이지를 벗어나시겠습니까?", test);

  // 뒤로가기를 할 경우
  useEffect(() => {
    history.listen((location) => {
      if (history.action === "POP") {
        dispatch(
          setPlaceInfo({
            placeName: "",
            placeAddr: "",
          })
        );
      }
    });
  }, []);

  const uploadData = (data: PostType) => {
    addDoc(collection(dbService, "posts"), data);
    setTest((prev) => !prev);

    alert("등록 완료");
    navigate(`/content`);

    setTitle("");
    setText("");
    setUploadPreview(""); // 파일 미리보기 img src 비워주기
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

    if (imageUpload !== null) {
      const attachmentRef = ref(storageService, `${userInfo.uid}/${uuidv4()}`); // 파일 경로 참조 생성
      // "https://firebasestorage.googleapis.com/v0/b/mind-oasis-66b9e.appspot.com/o/u1D7yAHTq4fOAXeIThoewbT9vYS2%2F070dbc05-c5be-4117-b944-99d620db1201?alt=media&token=ef68906f-49e7-44da-a42d-146caee97d2f"
      // ref정보가 data_url(format)으로 uploadPreview(value)에 담겨 upload 되도록 함
      const response = await uploadString(
        attachmentRef,
        uploadPreview,
        "data_url"
      ); // 파일 업로드(이 경우는 url)
      attachmentUrl = await getDownloadURL(response.ref);
    }

    const blankPattern = /^\s+|\s+$/g; //공백만 입력된 경우

    if (placeInfo.placeAddr === "") {
      alert("지도에서 위치를 선택해주세요");
    } else if (text.replace(blankPattern, "") === "" || text === "") {
      alert("내용을 입력해주세요");
    } else if (imageUpload === null) {
      alert("사진을 선택해주세요");
    } else if (placeKeyword.length === 0) {
      alert("키워드를 선택해주세요");

      //  title인풋에 공백만 있거나 값이 없는 경우엔 장소이름을 넣어준다.
    } else if (title.replace(blankPattern, "") === "" || title === "") {
      const postObj: PostType = {
        title: placeInfo.placeAddr,
        text: text,
        createdAt: Date.now(),
        creatorId: userInfo.uid,
        attachmentUrl,
        placeInfo,
        placeKeyword,
        likedUsers: [],
        likeState: false,
      };
      await uploadData(postObj);
    } else {
      const postObj: PostType = {
        title: title,
        text: text,
        createdAt: Date.now(),
        creatorId: userInfo.uid,
        attachmentUrl,
        placeInfo,
        placeKeyword,
        likedUsers: [],
        likeState: false,
      };
      await uploadData(postObj);
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

  // const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const theFile = e.currentTarget.files![0];
  //   console.log("theFile", theFile);
  //   const reader = new FileReader();
  //   reader.onloadend = (finishedEvent) => {
  //     console.log("finishedEvent", finishedEvent);
  //     console.log("reader.result", reader.result);
  //     setUploadPreview(reader.result);
  //   }; // 파일을 다 읽으면 finishedEvent를 받는다.
  //   reader.readAsDataURL(theFile); // 그 다음 데이터를 얻는다.
  // };

  // 이미지 리사이즈(압축) 함수
  const handleImageCompress = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let file = e.currentTarget?.files[0];

    const options = {
      maxSizeMB: 0.5, // 이미지 최대 용량
      // maxWidthOrHeight: 1920, // 최대 넓이(혹은 높이)
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log("compressedFile", compressedFile);
      setImageUpload(compressedFile);

      const promise = imageCompression.getDataUrlFromFile(compressedFile);
      promise.then((result) => {
        // console.log("result", result);
        setUploadPreview(result);
      });
    } catch (err) {
      console.log(err);
    }
  };

  // 파일을 첨부한 상태에서 clear 버튼을 누르는 경우
  const onClearUploadPreview = () => {
    setUploadPreview("");
    setImageUpload(null);
    fileInput.current!.value = ""; // 사진을 선택했다가 clear를 눌렀을때, 선택된 파일명을 지워줌.
  };

  return (
    <Container>
      <MapContainer>
        <SectionTitle>
          <span>1</span>
          <h2>지도에서 장소를 선택해주세요</h2>
        </SectionTitle>
        <MapSection placeAddr="" />
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
          onChange={handleImageCompress}
          // onChange={onFileChange}
          ref={fileInput}
        />
        {uploadPreview && (
          <>
            <img src={uploadPreview} width="50px" height="50px" alt="preview" />
            <button onClick={onClearUploadPreview}>Clear</button>
          </>
        )}
      </FileContainer>

      <CheckBoxContainer>
        <SectionTitle>
          <span>4</span>
          <h2>키워드를 선택해주세요</h2>
        </SectionTitle>

        <CheckBox checkedListArr={[]} />
      </CheckBoxContainer>

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
  width: 100%;
`;

const MapContainer = styled.section`
  margin-top: 0.45rem;
  width: 100%;
  margin-bottom: 2rem;
`;

const WriteContainer = styled.section`
  margin-top: 3.3rem;
  width: 100%;
  margin-bottom: 1.7rem;
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  padding: 0.7rem;
  margin-bottom: 1.85rem;
  border-bottom: 3px solid ${(props) => props.theme.colors.lightGray};

  span {
    margin-right: 0.5rem;
    width: 1.6rem;
    height: 1.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: ${(props) => props.theme.colors.yellow};
    font-size: 0.95rem;
    font-weight: 700;
    color: ${(props) => props.theme.colors.white};
  }

  h2 {
    font-size: 1.43rem;
    font-weight: 640;
  }
`;

const SubTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0 0 5px;
  color: ${(props) => props.theme.colors.darkGray};
`;

const TitleInput = styled.input`
  width: 100%;
  height: 3.3rem;
  font-size: 0.95rem;
  color: ${(props) => props.theme.colors.moreDarkGray};
  padding: 0 1.2rem;
  margin-bottom: 0.8rem;
  border-radius: 5px;
  border: ${(props) => props.theme.borders.gray};
  &:hover {
    outline: 1px solid #c9c9c9;
  }
  &:focus {
    outline: 1.8px solid ${(props) => props.theme.colors.yellow};
  }
`;

const TextInput = styled.textarea`
  width: 100%;
  height: 9.3rem;
  font-size: 0.95rem;
  color: ${(props) => props.theme.colors.moreDarkGray};
  padding: 1.1rem 1.2rem;
  border-radius: 5px;
  border: ${(props) => props.theme.borders.gray};
  line-height: 1.5rem;
  word-spacing: -0.3rem;
  resize: none;
  &:hover {
    outline: 1px solid #c9c9c9;
  }
  &:focus {
    outline: 1.8px solid ${(props) => props.theme.colors.yellow};
  }
`;

const FileContainer = styled.section`
  margin-top: 3.5rem;
  width: 100%;
  margin-bottom: 1.7rem;
`;

const FileInput = styled.input`
  width: 100%;
  height: 5rem;
  font-size: 0.9rem;
  color: ${(props) => props.theme.colors.moreDarkGray};
  padding: 0 1.2rem;
  border-radius: 5px;
  border: ${(props) => props.theme.borders.gray};
  cursor: pointer;
`;

const CheckBoxContainer = styled.section`
  margin-top: 3.5rem;
  width: 100%;
  margin-bottom: 1.7rem;
`;

const BtnContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const CancelBtn = styled.button`
  height: 2rem;
  color: black;
  background-color: ${(props) => props.theme.colors.lightGray};
  border-radius: 4px;
  margin: 0 0.5rem;
  padding: 0 1.25rem;
  font-size: 0.9rem;
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
