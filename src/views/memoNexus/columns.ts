import { formatToDateTime } from '@/utils/dateUtil';
import { MailAccount } from '@/model/mailAccount';

export const columns = [
  {
    title: 'id',
    key: 'id',
    width: 20,
  },
  {
    title: '用户名',
    key: 'username',
    width: 80,
  },
  {
    title: '昵称',
    key: 'nickName',
    width: 50,
  },
  {
    title: 'AT',
    key: 'openaiAccessToken',
    width: 100,
    render(row: MailAccount) {
      return row.openaiAccessToken === '' ? '-' : row.openaiAccessToken;
    },
  },
  {
    title: 'ClaudeSK',
    key: 'claudeSessionKey',
    width: 100,
    render(row: MailAccount) {
      return row.claudeSessionKey === '' ? '-' : row.claudeSessionKey;
    },
  },
  {
    title: 'ClaudeSK时间',
    key: 'claudeSessionKeyGetTime',
    width: 50,
    render(row: MailAccount) {
      return row.claudeSessionKeyGetTime === null
        ? '-'
        : formatToDateTime(new Date(row.claudeSessionKeyGetTime));
    },
  },
  {
    title: 'AT时间',
    key: 'openaiAccessTokenGetTime',
    width: 50,
    render(row: MailAccount) {
      return row.openaiAccessTokenGetTime === null
        ? '-'
        : formatToDateTime(new Date(row.openaiAccessTokenGetTime));
    },
  },
  {
    title: 'sk余额',
    key: 'openaiAmount',
    width: 20,
  },
  {
    title: 'sk',
    key: 'openaiSk',
    width: 50,
  },
  {
    title: 'sk到期时间',
    key: 'openaiSkExpire',
    width: 50,
    render(row: MailAccount) {
      return row.openaiSkExpire === null ? '-' : formatToDateTime(new Date(row.openaiSkExpire));
    },
  },
];
