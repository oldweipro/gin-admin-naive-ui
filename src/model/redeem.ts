export interface RedeemRequest {
  pieces: number;
  totalCount: number;
  amount: number;
  perLimit: number;
  status: number;
  expireTime: number;
}

export interface RedeemSearch {
  amount: number;
  startCreatedAt: number;
  endCreatedAt: number;
}

export interface RedeemResponse {
  id: number;
  code: string;
  amount: number;
  leftCount: number;
  totalCount: number;
  perLimit: number;
  status: number;
  totalRedeemed: number;
  expireTime: Date;
}
