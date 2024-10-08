import { ResourceMonitor } from "./ResourceMonitor";
// @ts-ignore
import pluginHostCode from "@playground/plugin-host/dist/plugin-host.es.js?raw";
import { APIRegistry } from "./APIProxy";
import { Sandbox } from "./Sandbox"; // 新增导入
import { SecurityManager } from "./SecurityManager";
import { IServiceBus } from "@playground/app-toolkit";

export class SandboxManager {
  private sandboxes: Map<string, Sandbox> = new Map();

  constructor(
    private serviceBus: IServiceBus,
    private securityManager: SecurityManager
  ) {}

  async createSandbox(pluginId: string, pluginCode: string): Promise<Sandbox> {
    const sandbox = new Sandbox(
      pluginId,
      pluginCode,
      this.getPluginHostCode(),
      this.serviceBus,
      this.securityManager
    );
    await sandbox.initialize();
    this.sandboxes.set(pluginId, sandbox);
    return sandbox;
  }

  private getPluginHostCode(): string {
    return pluginHostCode;
  }

  terminateSandbox(pluginId: string): void {
    const sandbox = this.sandboxes.get(pluginId);
    if (sandbox) {
      sandbox.terminate();
      this.sandboxes.delete(pluginId);
    }
  }

  getSandbox(pluginId: string): Sandbox | undefined {
    return this.sandboxes.get(pluginId);
  }

  getResourceMonitor(pluginId: string): ResourceMonitor | undefined {
    return this.getSandbox(pluginId)?.resourceMonitor;
  }
}
