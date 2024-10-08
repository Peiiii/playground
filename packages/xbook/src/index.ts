import { createServiceBus, Key } from "@playground/app-toolkit";
import { PluginManager } from "./sandbox-plugin-system";
export * from "./sandbox-plugin-system";
export * from "./utils";

export class Xbook {
  private serviceBus = createServiceBus();
  pluginManager: PluginManager = new PluginManager(this.serviceBus);
  useService = <T>(serviceName: Key<T>): T => {
    return this.serviceBus.createProxy(serviceName);
  };
  exposeService = <T>(serviceName: Key<T>, service: T) => {
    this.serviceBus.registerFromMap(serviceName, service);
  };
  use = (plugin: (context: Xbook) => void) => {
    plugin(this);
  };
}
