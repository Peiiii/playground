export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function evaluateModuleCode(code: string): Promise<any> {
  // 初版采用esm加载模块
  const blob = new Blob([code], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  try {
    const module = await import(/* webpackIgnore: true */ url);
    return module;
  } finally {
    URL.revokeObjectURL(url);
  }
}