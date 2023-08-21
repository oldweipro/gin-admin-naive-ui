import { h } from 'vue';
import { NTag } from 'naive-ui';
import { formatToDateTime } from '@/utils/dateUtil';

export const columns = [
  {
    title: 'id',
    key: 'id',
    width: 20,
  },
  {
    title: '地区',
    key: 'region',
    width: 80,
  },
  {
    title: '带宽',
    key: 'bandwidth',
    width: 80,
  },
  {
    title: '上行流量',
    key: 'up',
    width: 80,
  },
  {
    title: '下行流量',
    key: 'down',
    width: 80,
  },
  {
    title: '到期时间',
    key: 'expiry_time',
    width: 120,
    render(row) {
      return h(
        NTag,
        {
          type: 'success',
        },
        {
          default: () =>
            row.expiryTime === 0 ? '无限制' : formatToDateTime(new Date(row.expiryTime)),
        }
      );
    },
  },
];
