export interface ApiResponse<T = null> {
  data: T;
  status: string;
  code: number;
  error?: {
    message: string;
    type: string;
  };
}

export interface PaginatedApiResponse<T> {
  rows: T[];
  count: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

