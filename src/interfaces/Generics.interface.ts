export type Measurements = ['gr', 'un', 'ml'];
export type ProductType = ['BASIC', 'ELABORATED'];

export interface PaginationInfo {
  page: number;
  perPage: number;
  totalPages: number;
  totalProducts: number;
  nextPage: string | null;
  prevPage: string | null;
}

export type PaginatedData<Data> = {
  data: Data;
  pagination: PaginationInfo;
};
