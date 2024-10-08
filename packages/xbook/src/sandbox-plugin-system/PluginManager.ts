import { IServiceBus } from "@playground/app-toolkit";
import { MessageType } from "@playground/plugin-host";
import { APIRegistry } from "./APIProxy";
import { ConfigManager } from "./ConfigManager";
import { DependencyResolver } from "./DependencyResolver";
import { SandboxManager } from "./SandboxManager";
import { SecurityManager } from "./SecurityManager";
import { PluginMetadata, PluginStatus } from "./types";

export class PluginManager {
  private sandboxManager: SandboxManager;
  private securityManager: SecurityManager;
  private configManager: ConfigManager;
  private dependencyResolver: DependencyResolver;
  private pluginMetadataMap: Map<string, PluginMetadata> = new Map();
  private pluginStatuses: Map<string, PluginStatus> = new Map();
  serviceBus: IServiceBus;

  constructor(serviceBus: IServiceBus) {
    this.serviceBus = serviceBus;
    this.securityManager = new SecurityManager();
    this.sandboxManager = new SandboxManager(
      this.serviceBus,
      this.securityManager
    );
    this.configManager = new ConfigManager();
    this.dependencyResolver = new DependencyResolver();
  }

  async installPlugin(metadata: PluginMetadata, code: string): Promise<void> {
    console.log("installing plugin", metadata.id);
    if (this.pluginMetadataMap.has(metadata.id)) {
      throw new Error(`Plugin ${metadata.id} is already installed.`);
    }

    // Resolve dependencies
    const dependencies = await this.dependencyResolver.resolveDependencies(
      metadata
    );
    if (
      this.dependencyResolver.checkCircularDependencies([
        ...Array.from(this.pluginMetadataMap.values()),
        metadata,
      ])
    ) {
      throw new Error(
        `Circular dependency detected for plugin ${metadata.id}.`
      );
    }

    await this.sandboxManager.createSandbox(metadata.id, code);

    // Store plugin metadata
    this.pluginMetadataMap.set(metadata.id, metadata);
    this.pluginStatuses.set(metadata.id, PluginStatus.Inactive);
  }

  async uninstallPlugin(pluginId: string): Promise<void> {
    if (!this.pluginMetadataMap.has(pluginId)) {
      throw new Error(`Plugin ${pluginId} is not installed.`);
    }

    // Deactivate plugin if it's active
    if (this.getPluginStatus(pluginId) === PluginStatus.Active) {
      await this.deactivatePlugin(pluginId);
    }

    // Remove sandbox
    this.sandboxManager.terminateSandbox(pluginId);

    // Remove plugin data
    this.pluginMetadataMap.delete(pluginId);
    this.pluginStatuses.delete(pluginId);
    this.configManager.clearPluginConfig(pluginId);

    // console.log(`Plugin ${pluginId} uninstalled successfully.`);
  }

  async activatePlugin(pluginId: string): Promise<void> {
    if (!this.pluginMetadataMap.has(pluginId)) {
      throw new Error(`Plugin ${pluginId} is not installed.`);
    }

    if (this.getPluginStatus(pluginId) === PluginStatus.Active) {
      console.log(`Plugin ${pluginId} is already active.`);
      return;
    }

    const sandbox = this.sandboxManager.getSandbox(pluginId);
    if (!sandbox) {
      throw new Error(`Sandbox for plugin ${pluginId} not found.`);
    }

    sandbox.onceRemoteInitialized(() => {
      sandbox.emitRemote(MessageType.Activate, undefined);
      this.pluginStatuses.set(pluginId, PluginStatus.Active);
    });
  }

  async deactivatePlugin(pluginId: string): Promise<void> {
    if (!this.pluginMetadataMap.has(pluginId)) {
      throw new Error(`Plugin ${pluginId} is not installed.`);
    }

    if (this.getPluginStatus(pluginId) !== PluginStatus.Active) {
      console.log(`Plugin ${pluginId} is not active.`);
      return;
    }

    const sandbox = this.sandboxManager.getSandbox(pluginId);
    if (!sandbox) {
      throw new Error(`Sandbox for plugin ${pluginId} not found.`);
    }
    sandbox.emitRemote(MessageType.Deactivate, undefined);

    this.pluginStatuses.set(pluginId, PluginStatus.Inactive);
    console.log(`Plugin ${pluginId} deactivated successfully.`);
  }

  getPluginStatus(pluginId: string): PluginStatus {
    return this.pluginStatuses.get(pluginId) ?? PluginStatus.Error;
  }

  getInstalledPlugins(): PluginMetadata[] {
    return Array.from(this.pluginMetadataMap.values());
  }
}
