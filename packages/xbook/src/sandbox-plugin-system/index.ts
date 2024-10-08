import { createServiceBus } from "@playground/app-toolkit";
import { PluginManager } from "./PluginManager";
import { PluginMetadata, PluginCode, PluginStatus } from "./types";

// 定义插件接口（仅用于文档目的，不会包含在实际的插件代码中）
export interface Plugin {
  onActivate(): void;
  onDeactivate(): void;
  onUpdate?(): void;
  onMessage?(message: any): void;
}

// 示例插件代码
const examplePluginCode: PluginCode = `
 export async function activate(context) {
  console.log("[test get data]:", await context.api.getData());
  const disposable=await context.api.registerCommand("exampleCommand", (commandName, command) => {
    console.log("example command registered:", commandName);
    // Implement command registration logic here
  });
  context.subscriptions.push(disposable);
}

export function deactivate(context) {
  // console.log('Example plugin deactivated!');
  // 清理资源，移除事件监听器等
  context.api.unregisterCommand('exampleCommand');
}
`;

export const registerTestAPI = (pluginManager: PluginManager) => {
  pluginManager.serviceBus.register(
    "registerCommand",
    (commandName, command) => {
      console.log(`Registering command: ${commandName}`);
      // Implement command registration logic here
      return {
        dispose: () => {
          console.log(`Unregistering command: ${commandName}`);
          // Implement command unregistration logic here
        },
      };
    }
  );
  pluginManager.serviceBus.register("unregisterCommand", (commandName) => {
    // console.log(`Unregistering command: ${commandName}`);
    // Implement command unregistration logic here
  });
  pluginManager.serviceBus.register("getData", () => {
    console.log("Getting data");
    // Implement data retrieval logic here
    return { example: "data" };
  });
};

async function main() {
  const serviceBus = createServiceBus();
  const pluginManager = new PluginManager(serviceBus);

  registerTestAPI(pluginManager);

  (window as any).pluginManager = pluginManager;

  try {
    // 安装插件
    const pluginMetadata: PluginMetadata = {
      id: "example-plugin",
      name: "Example Plugin",
      version: "1.0.0",
      dependencies: [],
    };

    await pluginManager.installPlugin(pluginMetadata, examplePluginCode);
    // console.log(`Plugin ${pluginMetadata.id} installed successfully.`);

    // 激活插件
    await pluginManager.activatePlugin(pluginMetadata.id);
    // console.log(`Plugin ${pluginMetadata.id} activated.`);

    // 获取插件状态
    const status = pluginManager.getPluginStatus(pluginMetadata.id);
    // console.log(`Plugin ${pluginMetadata.id} status:`, status);

    // 停用插件
    // await pluginManager.deactivatePlugin(pluginMetadata.id);
    // // console.log(`Plugin ${pluginMetadata.id} deactivated.`);

    // // 卸载插件
    // await pluginManager.uninstallPlugin(pluginMetadata.id);
    // console.log(`Plugin ${pluginMetadata.id} uninstalled.`);

    // 获取已安装的插件列表
    const installedPlugins = pluginManager.getInstalledPlugins();
    // console.log("Installed plugins:", installedPlugins);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// main();

// 导出必要的类型和接口
export { PluginManager, PluginStatus };
export type { PluginMetadata, PluginCode };
