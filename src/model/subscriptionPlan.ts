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
  createdAt?: string;
  updatedAt?: string;
}
