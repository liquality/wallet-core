export const FAKE_ERROR = 'Fake Error';

export function getError(func: () => unknown) {
  try {
    return func();
  } catch (error) {
    return error;
  }
}
