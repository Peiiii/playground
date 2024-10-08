import { ApiGateway } from "./api-gateway";
import { WebWorkerCommunicationChannel } from "./communication-channel";
import {
  IDisposable,
  IPluginContext,
  IPluginModule,
  MessageType,
} from "./interfaces";
import { RemoveEventBus } from "./remove-event-bus";
import { evaluateModuleCode } from "./utils";

export class PluginHost {
  private pluginInstance?: IPluginModule;
  private subscriptions: IDisposable[] = [];
  private remoteEventBus = new RemoveEventBus(
    new WebWorkerCommunicationChannel()
  );
  private apiGateway = new ApiGateway(this.remoteEventBus);

  constructor() {
    setTimeout(() => {
      this.remoteEventBus.emitRemote(MessageType.Created, undefined);
    });
  }

  dispose(fn?: () => void) {
    if (fn) {
      this.subscriptions.push({
        dispose: fn,
      });
    } else {
      this.subscriptions.forEach((subscription) => {
        subscription.dispose();
      });
      this.subscriptions = [];
    }
  }

  listen() {
    this.dispose(
      this.remoteEventBus.onRemote(MessageType.Init, (payload: any) => {
        this.handleInitPlugin(payload.id, payload.code);
      })
    );
    this.dispose(
      this.remoteEventBus.onRemote(MessageType.Activate, () => {
        this.handleActivatePlugin();
      })
    );
    this.dispose(
      this.remoteEventBus.onRemote(MessageType.Deactivate, () => {
        this.handleDeactivatePlugin();
      })
    );
  }

  private createPluginContext(): IPluginContext {
    return {
      createProxy: this.apiGateway.createApiProxy,
      subscriptions: this.subscriptions,
    };
  }

  private async handleInitPlugin(id: string, code: string) {
    try {
      const pluginModule = await evaluateModuleCode(code);
      this.pluginInstance = pluginModule;
      this.remoteEventBus.emitRemote(MessageType.Initialized, { pluginId: id });
    } catch (error: any) {
      this.remoteEventBus.emitRemote(MessageType.Error, {
        error: `Failed to initialize plugin: ${error.message}`,
      });
    }
  }

  private async handleActivatePlugin() {
    if (
      this.pluginInstance &&
      typeof this.pluginInstance.activate === "function"
    ) {
      await this.pluginInstance.activate(this.createPluginContext());
      this.remoteEventBus.emitRemote(MessageType.Activated, undefined);
    }
  }

  private async handleDeactivatePlugin() {
    if (
      this.pluginInstance &&
      typeof this.pluginInstance.deactivate === "function"
    ) {
      await this.pluginInstance.deactivate(this.createPluginContext());
    }
    this.subscriptions.forEach((subscription) => {
      subscription.dispose();
    });
    this.subscriptions = [];
    this.remoteEventBus.emitRemote(MessageType.Deactivated, undefined);
  }
}
