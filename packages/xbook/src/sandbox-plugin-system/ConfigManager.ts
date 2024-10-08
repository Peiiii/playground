export class ConfigManager {
  private configs: Map<string, Map<string, any>> = new Map();

  getConfig(pluginId: string, key: string, defaultValue: any): any {
    const pluginConfig = this.configs.get(pluginId);
    if (pluginConfig && pluginConfig.has(key)) {
      return pluginConfig.get(key);
    }
    return defaultValue;
  }

  setConfig(pluginId: string, key: string, value: any): void {
    if (!this.configs.has(pluginId)) {
      this.configs.set(pluginId, new Map());
    }
    this.configs.get(pluginId)!.set(key, value);
  }

  deleteConfig(pluginId: string, key: string): void {
    const pluginConfig = this.configs.get(pluginId);
    if (pluginConfig) {
      pluginConfig.delete(key);
    }
  }

  clearPluginConfig(pluginId: string): void {
    this.configs.delete(pluginId);
  }
}