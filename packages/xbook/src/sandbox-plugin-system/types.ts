export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  dependencies: string[];
}

export enum PluginStatus {
  Active,
  Inactive,
  Error
}

// 新增 PluginCode 类型
export type PluginCode = string;

export interface Plugin {
  onActivate(): void | Promise<void>;
  onDeactivate(): void | Promise<void>;
  onUpdate?(): void | Promise<void>;
  onMessage?(message: any): void | Promise<void>;
}

export type PluginFactory = (context: any) => Plugin;