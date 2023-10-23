import { styled } from "styled-components";
import { useEffect, useRef, useState } from "react";
import { deleteObject, ref } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { dbService, storageService } from "../../fbase";
import { PostType } from "../../types/types";
import { setPlaceInfoReducer } from "../../store/placeInfoSlice";
import MapSection from "../../components/Map/MapSection";
import CheckBox from "../../components/UI/CheckBox";
import { createBrowserHistory } from "history";
import { usePrompt } from "../../hooks/useBlocker";
import imageCompression from "browser-image-compression";
import close from "../../assets/img/close-icon.png";
import { uploadImage } from "../../api/storage";

const EditPost = () => {
  const history = createBrowserHistory();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  // DetailsDropdown.tsx에서 받아온 (location.state) 파라미터 취득
  const state = location.state as { post: PostType; postId: string };
  const post = state.post;
  const postId = state.postId;

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [title, setTitle] = useState("");
  const [text, setText] = useState(post.text);
  const fileInput = useRef<HTMLInputElement>(null); // 기본값으로 null을 줘야함
  const { placeInfo } = useSelector((state: RootState) => state.placeInfo);
  const { placeKeyword } = useSelector(
    (state: RootState) => state.placeKeyword
  );
  const [imageUpload, setImageUpload] = useState({});
  const [uploadPreview, setUploadPreview] = useState<string>(
    post.attachmentUrl
  );

  const [when, setWhen] = useState(true);

  usePrompt("현재 페이지를 벗어나시겠습니까?", when);

  // 뒤로가기를 할 경우
  useEffect(() => {
    history.listen((location) => {
      if (history.action === "POP") {
        dispatch(
          setPlaceInfoReducer({
            placeName: "",
            placeAddr: "",
          })
        );
      }
    });
  }, []);

  const uploadData = (data: PostType) => {
    const postDocRef = doc(dbService, "posts", `${postId}`);
    updateDoc(postDocRef, { ...data });
    alert("등록 완료");
    setWhen((prev) => !prev);

    setTitle("");
    setText("");
    setUploadPreview(""); // 파일 미리보기 img src 비워주기
    fileInput.current!.value = "";
    dispatch(
      setPlaceInfoReducer({
        placeName: "",
        placeAddr: "",
      })
    );
  };

  // submit 할때마다 document를 생성
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let attachmentUrl: string = "";

    // 다른 파일을 새로 첨부하지 않고 기존 파일 그대로 업데이트 할 경우
    if (uploadPreview === post.attachmentUrl) {
      attachmentUrl = uploadPreview;
    }

    // 다른 파일을 새로 첨부하는 경우
    else if (imageUpload !== null) {
      attachmentUrl = await uploadImage(uploadPreview);

      // 기존 파일을 스토리지에서 삭제
      const postUrlRef = ref(storageService, post.attachmentUrl);
      await deleteObject(postUrlRef);
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
        createdAt: post.createdAt,
        creatorId: userInfo.uid,
        attachmentUrl,
        placeInfo,
        placeKeyword,
      };
      uploadData(postObj);
    } else {
      const postObj: PostType = {
        title: title,
        text: text,
        createdAt: post.createdAt,
        creatorId: userInfo.uid,
        attachmentUrl,
        placeInfo,
        placeKeyword,
      };
      uploadData(postObj);
    }
  };

  // 취소 버튼 클릭
  const onCancelClick = () => {
    navigate(-1);
  };

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

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
      setImageUpload(compressedFile);

      const promise = imageCompression.getDataUrlFromFile(compressedFile);
      promise.then((result) => {
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
  };

  useEffect(() => {
    if (when === false) {
      navigate("/");
    }
  }, [when]);

  return (
    <Container>
      <EditPostContainer>
        <MapContainer>
          <SectionTitle>
            <span>1</span>
            <h2>지도에서 장소를 선택해주세요</h2>
          </SectionTitle>
          <MapSection placeAddr={post.placeInfo.placeAddr} />
        </MapContainer>

        <WriteContainer>
          <SectionTitle>
            <span>2</span>
            <h2>장소에 대해 알려주세요</h2>
          </SectionTitle>
          <InputTitle>제목</InputTitle>
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

          <ImgViewerWrapper htmlFor="input-file">
            {uploadPreview ? (
              <ImgViewer>
                <FileImg src={uploadPreview} alt="preview photo"></FileImg>
              </ImgViewer>
            ) : (
              <EmptyDiv>
                <p>사진 업로드</p>
              </EmptyDiv>
            )}
          </ImgViewerWrapper>

          {uploadPreview && (
            <DelBtn onClick={onClearUploadPreview}>
              <DelIcon />
            </DelBtn>
          )}

          <FileInput
            id="input-file"
            type="file"
            accept="image/*"
            onChange={handleImageCompress}
            ref={fileInput}
          />
        </FileContainer>

        <CheckBoxContainer>
          <SectionTitle>
            <span>4</span>
            <h2>키워드를 선택해주세요</h2>
          </SectionTitle>
          <CheckBox checkedListArr={post.placeKeyword} />
        </CheckBoxContainer>

        <BtnContainer>
          <CancelBtn onClick={onCancelClick}>취소</CancelBtn>
          <PostBtn onClick={onSubmit}>등록</PostBtn>
        </BtnContainer>
      </EditPostContainer>
    </Container>
  );
};

export default EditPost;

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 38.7rem;
  margin: 2.8rem auto;
`;

const EditPostContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 3rem;
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

const InputTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0 0 0.3125rem;
  color: ${(props) => props.theme.colors.darkGray};
`;

const TitleInput = styled.input`
  width: 100%;
  height: 3.3rem;
  font-size: 0.95rem;
  color: ${(props) => props.theme.colors.moreDarkGray};
  padding: 0 1.2rem;
  margin-bottom: 0.8rem;
  border-radius: 0.315rem;
  border: ${(props) => props.theme.borders.gray};
  &:hover {
    outline: 1px solid #d3d3d3;
  }
  &:focus {
    border: 1px solid ${(props) => props.theme.colors.darkYellow};
    outline: 1px solid ${(props) => props.theme.colors.darkYellow};
  }
`;

const TextInput = styled.textarea`
  width: 100%;
  height: 9.3rem;
  font-size: 0.95rem;
  color: ${(props) => props.theme.colors.moreDarkGray};
  padding: 1.1rem 1.2rem;
  border-radius: 0.315rem;
  border: ${(props) => props.theme.borders.gray};
  line-height: 1.5rem;
  word-spacing: -0.3rem;
  resize: none;

  &::placeholder {
    color: ${(props) => props.theme.colors.gray1};
  }
  &:hover {
    outline: 1px solid #d3d3d3;
  }
  &:focus {
    border: 1px solid ${(props) => props.theme.colors.darkYellow};
    outline: 1px solid ${(props) => props.theme.colors.darkYellow};
  }
`;

const FileContainer = styled.section`
  width: 100%;
  margin-top: 3.5rem;
  margin-bottom: 1.7rem;
`;

const FileInput = styled.input`
  display: none;
  width: 100%;
  height: 5rem;
`;

const ImgViewerWrapper = styled.label``;

const ImgViewer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FileImg = styled.img`
  max-width: 20rem;
  height: 7rem;
  object-fit: cover;
`;

const DelBtn = styled.button`
  width: 100%;
`;

const DelIcon = styled.img.attrs({
  src: close,
})`
  width: 0.55rem;
  margin-top: 0.5rem;
`;

const EmptyDiv = styled.div`
  width: 100%;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 400;
  color: ${(props) => props.theme.colors.gray1};
  border-radius: 0.315rem;
  border: 3px dotted #d3d3d3;
  cursor: pointer;

  &:hover {
    border-color: ${(props) => props.theme.colors.yellow};
  }
`;

const CheckBoxContainer = styled.section`
  margin-top: 3.5rem;
  width: 100%;
  margin-bottom: 1.7rem;
`;

const BtnContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
`;

const CancelBtn = styled.button`
  width: 6.8rem;
  height: 2.7rem;
  color: black;
  background-color: #e5e5e5;
  border-radius: 0.5rem;
  margin: 0 0.45rem;
  padding: 0.1rem 1.25rem 0 1.25rem;
  font-size: 0.94rem;
  font-weight: 500;

  @media ${(props) => props.theme.mobile} {
    /* width: 5rem;
    height: 2rem; */
  }
`;
const PostBtn = styled(CancelBtn)`
  color: ${(props) => props.theme.colors.white};
  background-color: ${(props) => props.theme.colors.lightBlack};

  &:hover {
    background-color: ${(props) => props.theme.colors.darkGray};
  }
`;
