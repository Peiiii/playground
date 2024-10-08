import React, { useEffect, useMemo, useState } from "react";
import { PluginMetadata, PluginStatus, registerTestAPI } from "xbook";
import { xbook } from "../../xbook";

// 示例插件代码
const examplePluginCode = `
 export async function activate(context) {
  const demoService = context.createProxy("demoService");
  demoService.hi();
}

export function deactivate(context) {
  // console.log('Example plugin deactivated!');
  // 清理资源，移除事件监听器等
  context.api.unregisterCommand('exampleCommand');
}
`;

const quickTemplate = `
export async function activate(context) {
  const demoService = context.createProxy("demoService");
  demoService.hi();
}

export function deactivate(context) {
  // console.log('Example plugin deactivated!');
  // 清理资源，移除事件监听器等
  context.unregisterCommand('exampleCommand');
}
`;
const examplePluginMetadata: PluginMetadata = {
  id: "example-plugin",
  name: "Example Plugin",
  version: "1.0.0",
  dependencies: [],
};

const XBookDemo: React.FC = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pluginManager = useMemo(() => {
    const pm = xbook.pluginManager;
    registerTestAPI(pm);
    pm.installPlugin(examplePluginMetadata, examplePluginCode);
    return pm;
  }, []);
  const [plugins, setPlugins] = useState<PluginMetadata[]>(() =>
    pluginManager.getInstalledPlugins()
  );
  const [newPluginCode, setNewPluginCode] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).pluginManager = pluginManager;

  useEffect(() => {
    updatePluginList();
  }, []);

  const updatePluginList = () => {
    setPlugins(pluginManager.getInstalledPlugins());
  };

  const installPlugin = async () => {
    const metadata: PluginMetadata = {
      id: `plugin-${Date.now()}`,
      name: `Plugin ${plugins.length + 1}`,
      version: "1.0.0",
      dependencies: [],
    };

    try {
      await pluginManager.installPlugin(metadata, newPluginCode);
      setNewPluginCode("");
      updatePluginList();
    } catch (error) {
      console.error("Failed to install plugin:", error);
    }
  };

  const activatePlugin = async (pluginId: string) => {
    try {
      await pluginManager.activatePlugin(pluginId);
      updatePluginList();
    } catch (error) {
      console.error("Failed to activate plugin:", error);
    }
  };

  const deactivatePlugin = async (pluginId: string) => {
    try {
      await pluginManager.deactivatePlugin(pluginId);
      updatePluginList();
    } catch (error) {
      console.error("Failed to deactivate plugin:", error);
    }
  };

  const uninstallPlugin = async (pluginId: string) => {
    try {
      await pluginManager.uninstallPlugin(pluginId);
      updatePluginList();
    } catch (error) {
      console.error("Failed to uninstall plugin:", error);
    }
  };

  return (
    <div>
      <h2>XBook Plugin System Demo</h2>
      <div>
        <h3>Install New Plugin</h3>
        <textarea
          value={newPluginCode}
          onChange={(e) => setNewPluginCode(e.target.value)}
          placeholder="Enter plugin code here..."
          rows={5}
          cols={50}
        />
        <br />
        <button onClick={installPlugin}>Install Plugin</button>
      </div>
      <div>
        <h3>Installed Plugins</h3>
        <span onClick={updatePluginList}>Refresh</span>
        <span
          onClick={() => {
            setNewPluginCode(quickTemplate);
          }}
        >
          use quick template
        </span>
        <ul>
          {plugins.map((plugin) => (
            <li key={plugin.id}>
              {plugin.name} (Status:{" "}
              {PluginStatus[pluginManager.getPluginStatus(plugin.id)]})
              <button onClick={() => activatePlugin(plugin.id)}>
                Activate
              </button>
              <button onClick={() => deactivatePlugin(plugin.id)}>
                Deactivate
              </button>
              <button onClick={() => uninstallPlugin(plugin.id)}>
                Uninstall
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default XBookDemo;
