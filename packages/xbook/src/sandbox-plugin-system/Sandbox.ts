import { Disposable, IServiceBus } from "@playground/app-toolkit";
import {
  IMessageData,
  MessageType,
  RemoveEventBus,
} from "@playground/plugin-host";
import { APIRegistry } from "./APIProxy";
import { WebWorkerCommunicationChannel } from "./CommunicationChannel";
import { ResourceMonitor } from "./ResourceMonitor";
import { SecurityManager } from "./SecurityManager";
export class Sandbox extends Disposable {
  private worker: Worker;
  public resourceMonitor: ResourceMonitor;
  remoteInitialized: boolean = false;
  private removeEventBus: RemoveEventBus;

  constructor(
    private pluginId: string,
    private pluginCode: string,
    private pluginHostCode: string,
    private serviceBus: IServiceBus,
    private securityManager: SecurityManager
  ) {
    super();
    this.resourceMonitor = new ResourceMonitor(50, 100 * 1024 * 1024); // 50% CPU, 100MB memory
  }

  async initialize(): Promise<void> {
    const pluginCodeBlob = new Blob([this.pluginHostCode], {
      type: "application/javascript",
    });
    const pluginCodeUrl = URL.createObjectURL(pluginCodeBlob);
    const combinedCode = `
      async function start() {
        const { PluginHost } = await import("${pluginCodeUrl}");
        // 初始化 PluginHost
        const pluginHost = new PluginHost();
        pluginHost.listen();
      }
      start();
    `;

    const blob = new Blob([combinedCode], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(blob);
    this.worker = new Worker(workerUrl);
    this.removeEventBus = new RemoveEventBus(
      new WebWorkerCommunicationChannel(this.worker)
    );

    this.onRemoteInitialized(() => {
      this.remoteInitialized = true;
    });

    this.setupListeners();

    return new Promise((resolve) => {
      const handleMessage = (event: MessageEvent<IMessageData>) => {
        if (event.data.type === MessageType.Created) {
          this.removeEventBus.emitRemote(MessageType.Init, {
            id: this.pluginId,
            code: this.pluginCode,
          });
          resolve();
        }
      };
      this.worker.addEventListener("message", handleMessage, { once: true });
      this.onDispose(() =>
        this.worker.removeEventListener("message", handleMessage)
      );
    });
  }

  private setupListeners() {
    let dispose = this.removeEventBus.onRemote(
      MessageType.ApiCall,
      async (message) => {
        const {
          requestId,
          data: { method, args },
        } = message;
        // const res = await this.apiRegistry.callAPI(method, args);
        console.log("call api", method, args);
        const res = await this.serviceBus.invoke(method, ...args);
        this.removeEventBus.emitRemote(MessageType.ApiResponse, {
          requestId,
          data: res,
        });
      }
    );
    this.onDispose(dispose);
  }

  terminate(): void {
    this.worker.terminate();
    this.dispose();
  }

  private onRemoteInitialized(callback: () => void): () => void {
    return this.removeEventBus.onRemote(MessageType.Initialized, callback);
  }

  emitRemote(type: MessageType, payload?: any): void {
    this.removeEventBus.emitRemote(type, payload);
  }

  onceRemoteInitialized(callback: () => void): () => void {
    if (this.remoteInitialized) {
      callback();
      return () => {};
    } else {
      return this.onRemoteInitialized(callback);
    }
  }
}
