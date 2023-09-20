import * as yup from "yup";

export const signUpSchema = yup.object().shape({
  email: yup
    .string()
    .matches(/^[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+$/, "영문으로만 입력할 수 있습니다.")
    .matches(
      /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      "이메일 주소에 '@'를 포함해 주세요."
    )
    .required("이메일을 입력해주세요."),
  nickname: yup
    .string()
    .min(2, "최소 2글자 이상 입력해야 합니다.")
    .max(16, "최대 16글자 까지 입력할 수 있습니다.")
    .matches(/^[^\s]+$/, "띄어쓰기를 사용할 수 없습니다.")
    .required("닉네임을 입력해주세요."),
  password: yup
    .string()
    .min(6, "최소 6글자 이상 입력해야 합니다.")
    .max(16, "최대 16글자 까지 입력할 수 있습니다.")
    .matches(
      /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W))/,
      "영문, 숫자, 특수문자가 포함되어야 합니다."
    )
    .matches(/^[^\s]+$/, "띄어쓰기를 사용할 수 없습니다.")
    .required("비밀번호를 입력해주세요."),
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .matches(/^[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+$/, "영문으로만 입력할 수 있습니다.")
    .matches(
      /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      "이메일 주소에 '@'를 포함해 주세요."
    )
    .required("이메일을 입력해주세요."),
  password: yup
    .string()
    .min(6, "최소 6글자 이상 입력해야 합니다.")
    .max(16, "최대 16글자 까지 입력할 수 있습니다.")
    .matches(
      /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W))/,
      "영문, 숫자, 특수문자가 포함되어야 합니다."
    )
    .matches(/^[^\s]+$/, "띄어쓰기를 사용할 수 없습니다.")
    .required("비밀번호를 입력해주세요."),
});

export const UpdateProfileSchema = yup.object().shape({
  nickname: yup
    .string()
    .min(2, "최소 2글자 이상 입력해야 합니다.")
    .max(16, "최대 16글자 까지 입력할 수 있습니다.")
    .matches(/^[^\s]+$/, "띄어쓰기를 사용할 수 없습니다.")
    .required("닉네임을 입력해주세요."),
});
