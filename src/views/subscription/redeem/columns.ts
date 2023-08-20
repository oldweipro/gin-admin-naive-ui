import { h } from 'vue';
import { NTag } from 'naive-ui';
import { formatToDateTime } from '@/utils/dateUtil';
import { RedeemResponse } from '@/model/redeem';
import { copyToClip } from '@/utils/copy';

export const columns = [
  {
    title: 'id',
    key: 'id',
    width: 50,
  },
  {
    title: '兑换码',
    key: 'code',
    width: 300,
    render(row: RedeemResponse) {
      return h(
        NTag,
        {
          type: 'info',
          onClick: async () => {
            await copyToClip(row.code);
          },
        },
        {
          default: () => row.code,
        }
      );
    },
  },
  {
    title: '兑换次数',
    key: 'totalCount',
    width: 50,
  },
  {
    title: '面额',
    key: 'amount',
    width: 50,
  },
  {
    title: '兑换几次',
    key: 'perLimit',
    width: 50,
  },
  {
    title: '剩余次数',
    key: 'leftCount',
    width: 50,
  },
  {
    title: '已用次数',
    key: 'totalRedeemed',
    width: 50,
  },
  {
    title: '状态',
    key: 'status',
    width: 50,
    render(row: RedeemResponse) {
      return h(
        NTag,
        {
          type: row.status === 1 ? 'info' : 'success',
        },
        {
          default: () => (row.status === 1 ? '已使用' : '未使用'),
        }
      );
    },
  },
  {
    title: '到期时间',
    key: 'expireTime',
    width: 100,
    render(row: RedeemResponse) {
      return h(
        NTag,
        {
          type: 'info',
        },
        {
          default: () => formatToDateTime(new Date(row.expireTime)),
        }
      );
    },
  },
];
