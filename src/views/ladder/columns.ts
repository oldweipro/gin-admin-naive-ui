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
    title: '已用上行流量',
    key: 'up',
    width: 80,
    render(row) {
      return h(
        NTag,
        {
          type: 'success',
        },
        {
          default: () =>
            row.up > 1024 * 1024 * 1024
              ? (row.up / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
              : (row.up / (1024 * 1024)).toFixed(2) + 'MB',
        }
      );
    },
  },
  {
    title: '已用下行流量',
    key: 'down',
    width: 80,
    render(row) {
      return h(
        NTag,
        {
          type: 'success',
        },
        {
          default: () =>
            row.down > 1024 * 1024 * 1024
              ? (row.down / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
              : (row.down / (1024 * 1024)).toFixed(2) + 'MB',
        }
      );
    },
  },
  {
    title: '到期时间',
    key: 'expiry_time',
    width: 120,
    render(row) {
      return h(
        NTag,
        {
          type: row.expiryTime === 0 ? 'warning' : 'success',
        },
        {
          default: () =>
            row.expiryTime === 0 ? '暂无订阅计划' : formatToDateTime(new Date(row.expiryTime)),
        }
      );
    },
  },
];
