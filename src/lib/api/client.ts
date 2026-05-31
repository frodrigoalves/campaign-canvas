export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function mockRequest<T>(value: T, delay = 300): Promise<T> {
  await sleep(delay);
  return value;
}
