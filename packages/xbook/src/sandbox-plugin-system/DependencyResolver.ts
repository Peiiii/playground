import { PluginMetadata } from './types';

export class DependencyResolver {
  async resolveDependencies(plugin: PluginMetadata): Promise<PluginMetadata[]> {
    // 实现解析依赖逻辑
    return [];
  }

  checkCircularDependencies(plugins: PluginMetadata[]): boolean {
    // 实现检查循环依赖逻辑
    return false;
  }
}