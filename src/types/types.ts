export interface IPostType {
  id?: string;
  title?: string;
  text?: string;
  createdAt?: number;
  creatorId?: string;
  attachmentUrl?: string;
  placeInfo?: {
    placeName: string;
    placeAddr: string;
  };
}

export interface UserInfoType {
  displayName: string;
  uid: string;
  photoURL: string;
}
