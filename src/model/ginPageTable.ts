export interface GinPageTable<T> {
  list: T[];
  page: number;
  pageSize: number;
  total: number;
}
