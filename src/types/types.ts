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
  placeKeyword?: string[];
  likedUsers?: string[];
  likeState?: boolean;
}

export interface UserDocType {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  myLikes: string[];
}

export interface UserInfoType {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export interface CommentType {
  id?: string;
  userId?: string;
  userPhotoURL?: string;
  userDisplayName?: string;
  createdAt?: number;
  text?: string;
  postId?: string;
}
