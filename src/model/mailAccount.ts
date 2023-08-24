export interface MailAccountRequest {
  pieces: number;
  totalCount: number;
  amount: number;
  perLimit: number;
  status: number;
  expireTime: number;
}

export interface MailAccountIdsRequest {
  ids: number[];
}

export interface MailAccountSearch {
  startCreatedAt: number;
  endCreatedAt: number;
}

export interface MailAccountPage<T> {
  list: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface MailAccount {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  nickName: string;
  remark: string;
  password: string;
  claudeSessionKey: string;
  claudeSessionKeyGetTime: Date;
  openaiPassword: string;
  openaiAccessToken: string;
  openaiAccessTokenGetTime: Date;
  openaiSkExpire: Date;
  openaiSk: string;
  openaiAmount: number;
  openaiStatus: number;
}
