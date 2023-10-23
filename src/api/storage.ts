import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storageService } from "../fbase";
import { v4 as uuidv4 } from "uuid";

export const uploadImage = async (uploadPreview: string) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // "https://firebasestorage.googleapis.com/v0/b/mind-oasis-66b9e.appspot.com/o/u1D7yAHTq4fOAXeIThoewbT9vYS2%2F070dbc05-c5be-4117-b944-99d620db1201?alt=media&token=ef68906f-49e7-44da-a42d-146caee97d2f"
  // ref정보가 data_url(format)으로 uploadPreview(value)에 담겨 upload 되도록 함
  const attachmentRef = ref(storageService, `${userInfo.uid}/${uuidv4()}`); // 파일 경로 참조 생성
  const response = await uploadString(attachmentRef, uploadPreview, "data_url"); // 파일 업로드(이 경우는 url)
  const url = await getDownloadURL(response.ref);

  return url;
};
