export async function processPdfBuffer(buffer: ArrayBuffer | Buffer) {
  // Placeholder PDF worker — implement parsing/extraction as needed.
  // For now, return a minimal summary object.
  const size = buffer ? (buffer as any).byteLength ?? (buffer as any).length ?? 0 : 0;
  return Promise.resolve({ pages: 0, size });
}

export default { processPdfBuffer };
