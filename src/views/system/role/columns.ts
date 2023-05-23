import { h } from 'vue';
import { NTag } from 'naive-ui';

export const columns = [
  {
    title: 'id',
    key: 'authorityId',
  },
  {
    title: '角色名称',
    key: 'authorityName',
  },
  {
    title: '说明',
    key: 'explain',
  },
  {
    title: '是否默认角色',
    key: 'isDefault',
    render(row) {
      return h(
        NTag,
        {
          type: row.isDefault ? 'success' : 'error',
        },
        {
          default: () => (row.isDefault ? '是' : '否'),
        }
      );
    },
  },
  {
    title: '创建时间',
    key: 'CreatedAt',
  },
];
