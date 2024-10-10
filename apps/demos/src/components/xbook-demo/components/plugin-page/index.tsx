import React, { useEffect, useMemo, useState } from "react";
import { PluginMetadata, PluginStatus, registerTestAPI } from "xbook";
import { xbook } from "../../xbook";
import {
  CustomMonacoEditor,
  MonacoKeyMod,
  MonacoKeyCode,
} from "../../../custom-monaco-editor";
import { Editor } from "./editor";

// 示例插件代码
const examplePluginCode = `
 export async function activate(context) {
  const hello = context.createProxy("hello");
  hello.sayHello();
}

export function deactivate(context) {
  // console.log('Example plugin deactivated!');
  // 清理资源，移除事件监听器等
  context.api.unregisterCommand('exampleCommand');
}
`;

const quickTemplate = `
export async function activate(context) {
  const hello = context.createProxy("hello");
  hello.sayHello();
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

xbook.exposeService("hello", {
  sayHello: () => {
    window.alert("hello");
  },
});

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
  const [newPluginCode, setNewPluginCode] = useState(quickTemplate);

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

  const handleEditorChange = (value: string) => {
    setNewPluginCode(value);
  };

  return (
    <div>
      <h2>XBook Plugin System Demo</h2>
      <div>
        <h3>Install New Plugin</h3>
        <div
          style={{ height: "300px", width: "800px", border: "1px solid #ccc" }}
        >
          <Editor defaultValue={newPluginCode} language="javascript" />
        </div>
        <br />
        <button onClick={installPlugin}>Install Plugin</button>
        <button onClick={() => setNewPluginCode(quickTemplate)}>
          Use Quick Template
        </button>
      </div>
      <div>
        <h3>Installed Plugins</h3>
        <button onClick={updatePluginList}>Refresh</button>
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
