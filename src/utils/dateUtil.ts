import { format } from 'date-fns';

const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';

export function formatToDateTime(date: Date | number, formatStr = DATE_TIME_FORMAT): string {
  return format(date, formatStr);
}
