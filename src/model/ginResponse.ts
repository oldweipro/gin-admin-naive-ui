export interface GinResponse<T> {
  code: number;
  msg: string;
  data: T;
}
