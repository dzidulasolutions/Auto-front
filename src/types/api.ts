export interface ApiSuccess<T> {
  success: true;
  data: T;
  timestamp: string;
}

export interface ApiFailure {
  success: false;
  error: { statusCode: number; message: string | string[]; path: string };
  timestamp: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}