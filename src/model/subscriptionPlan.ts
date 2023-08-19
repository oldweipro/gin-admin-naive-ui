export interface SubscriptionPlan {
  id?: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  quantity: number;
  menuId: number;
  tag: number;
  status: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubscriptionUser {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  subscriptionPlanId: number;
  userId: number;
  status: number;
  startTime?: Date;
  endTime?: Date;
}

export interface SubscribeRequest {
  planId: number;
}
