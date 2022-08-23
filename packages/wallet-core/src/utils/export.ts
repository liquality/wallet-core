import { HistoryItem } from '../store/types';

export const getCSVContent = (data: HistoryItem[], headers: { label: string; key: string }[]) => {
  if (!data == null || !data.length) {
    return null;
  }

  const columnDelimiter = ',';
  const lineDelimiter = '\n';

  let result = `${headers.map((h) => h.label).join(columnDelimiter)}${lineDelimiter}`;

  data.forEach((item) => {
    let ctr = 0;
    headers.forEach((header) => {
      if (ctr > 0) result += columnDelimiter;

      result += item[header.key as keyof HistoryItem];
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
};
