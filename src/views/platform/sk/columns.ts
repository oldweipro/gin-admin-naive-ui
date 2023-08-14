import { h } from 'vue';
import { NTime, NButton } from 'naive-ui';

export const columns = [
  {
    title: 'id',
    key: 'ID',
    width: 20,
  },
  {
    title: 'sk名称',
    key: 'skName',
    width: 50,
  },
  {
    title: 'sk密钥',
    key: 'sk',
    width: 200,
  },
  {
    title: '过期时间',
    key: 'expire',
    width: 80,
    render(row) {
      if (row.expire === 0) {
        return h(
          NButton,
          {
            strong: true,
            secondary: true,
            type: 'success',
            size: 'small',
          },
          { default: () => '无限制' }
        );
      } else {
        return h(NTime, {
          time: new Date(row.expire),
        });
      }
    },
  },
  {
    title: '状态',
    key: 'status',
    width: 40,
    render(row) {
      return h(
        NButton,
        {
          strong: true,
          secondary: true,
          type: row.status === 0 ? 'error' : 'success',
          size: 'small',
        },
        { default: () => (row.status === 0 ? '禁用' : '启用') }
      );
    },
  },
];
