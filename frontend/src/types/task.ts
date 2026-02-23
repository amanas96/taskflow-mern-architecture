export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}
