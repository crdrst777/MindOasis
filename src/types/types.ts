export type PlaceInfoType = {
  placeName: string;
  placeAddr: string;
};

export interface PostType {
  id?: string;
  title?: string;
  text?: string;
  createdAt?: number;
  creatorId?: string;
  attachmentUrl?: string;
  placeInfo?: PlaceInfoType;
}

// export interface UserDocType {
//   email: string;
//   displayName?: string;
//   uid: string;
//   photoURL?: string;
// }

export interface UserInfoType {
  displayName: string;
  uid: string;
  photoURL: string;
}
