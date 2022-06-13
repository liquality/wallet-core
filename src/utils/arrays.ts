// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function chunkArray<T = any>(arr: Array<T>, size: number) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
