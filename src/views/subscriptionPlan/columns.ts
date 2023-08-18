import { h } from 'vue';
import { NTag } from 'naive-ui';
import { SubscriptionPlan } from '@/model/subscriptionPlan';

export const columns = [
  {
    title: 'id',
    key: 'id',
    width: 50,
  },
  {
    title: '名称',
    key: 'name',
    width: 100,
  },
  {
    title: '价格',
    key: 'price',
    width: 100,
  },
  {
    title: '时长',
    key: 'duration',
    width: 100,
  },
  {
    title: '标记',
    key: 'tag',
    width: 100,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row: SubscriptionPlan) {
      return h(
        NTag,
        {
          type: row.status === 1 ? 'success' : 'error',
        },
        {
          default: () => (row.status === 1 ? '启用' : '禁用'),
        }
      );
    },
  },
  {
    title: '创建时间',
    key: 'createdAt',
    width: 200,
  },
];
