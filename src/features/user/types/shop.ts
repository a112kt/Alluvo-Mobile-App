export type FiltersState = {
  mainCategory: mainCategoryType[];
  priceRange: number[];
  stockStatus: string | null;
  sizesSelected: sizeType[];
  colors: colorType[];
  Search: string;
  SortItem: sortOptionType | null;
};

export type mainCategoryType = {
  id: string;
  name: string;
  arName: string;
};

export type colorType = {
  hexCode: string;
  id: number;
  name: string;
  arName: string;
};

export type sortOptionType = {
  label: string;
  SortBy: string;
  SortOrder: string;
};

export type sizeType = {
  id: number;
  name: string;
  arName: string;
};
