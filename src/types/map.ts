export interface PlaceType {
  place_name: string;
  address_name: string;
  road_address_name?: string;
  category_group_code: string;
  category_group_name: string;
  id: string;
  x: string;
  y: string;
}

export interface PaginaionType {
  current: number;
  first: number;
  gotoFirst: () => void;
  gotoLast: () => void;
  gotoPage: (a: number) => void;
  hasNextPage: true;
  hasPrevPage: true;
  last: number;
  nextPage: () => void;
  perPage: number;
  prevPage: () => void;
  totalCount: number;
}
