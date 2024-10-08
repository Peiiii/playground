/**
 * 表示可释放的资源。
 */
export interface IDisposable {
  dispose(): Promise<void> | void;
}

/**
 * 表示主机和插件之间可以交换的消息类型及其相关数据结构。
 */
export enum MessageType {
  // commands
  Init = "init",
  Activate = "activate",
  Deactivate = "deactivate",
  ExecuteCallback = "execute-callback",
  // requests
  ApiCall = "api-call",
  Dispose = "dispose",
  // responses
  ApiResponse = "api-response",
  // events
  Created = "created",
  Initialized = "initialized",
  Activated = "activated",
  Deactivated = "deactivated",
  Error = "error",
}

/**
 * 表示主机和插件之间交换的消息结构。
 */
export interface IMessageData<P = any> {
  type: MessageType;
  //   id: string;
  payload: P;
  //   error?: string;
}

export interface RequestData<P = any> {
  requestId: string;
  data: P;
}

export interface ResponseData<P = any> {
  requestId: string;
  data: P;
  error?: string;
}

/**
 * 定义每种消息类型对应的payload类型
 */
export interface MessagePayloads {
  [MessageType.Init]: { id: string; code: string };
  [MessageType.Activate]: undefined;
  [MessageType.Deactivate]: undefined;
  [MessageType.Created]: undefined;
  [MessageType.Initialized]: { pluginId: string };
  [MessageType.Activated]: undefined;
  [MessageType.Deactivated]: undefined;
  [MessageType.Error]: { error: string };

  [MessageType.ExecuteCallback]: RequestData<{ id: string; args: any[] }>;
  [MessageType.ApiCall]: RequestData<{ method: string; args: any[] }>;
  [MessageType.ApiResponse]: ResponseData;
  [MessageType.Dispose]: RequestData<{ id: string }>;

}

/**
 * 表示提供给插件的上下文。
 */
export interface IPluginContext {
  subscriptions: IDisposable[];
  createProxy: (prefix: string) => IApiProxy;
}

/**
 * 表示插件模块。
 */
export interface IPluginModule {
  activate(context: IPluginContext): Promise<void> | void;
  deactivate(context: IPluginContext): Promise<void> | void;
}

/**
 * 表示主机和插件之间的通信通道。
 */
export interface ICommunicationChannel {
  send(message: IMessageData): void;
  onReceive(
    handler: (message: IMessageData) => void,
    options?: boolean | AddEventListenerOptions
  ): () => void;
}

/**
 * 主机与插件之间的事件总线
 */
export interface IRemoteEventBus {
  onRemote<T extends MessageType>(
    event: T,
    listener: (payload: MessagePayloads[T]) => void
  ): () => void;
  off<T extends MessageType>(
    event: T,
    listener: (payload: MessagePayloads[T]) => void
  ): void;
  emitRemote<T extends MessageType>(
    event: T,
    payload: MessagePayloads[T]
  ): void;
}

/**
 * 表示用于管理函数代理的函数网关。
 */
export interface IFunctionGateway {
  localToRemote(maybeFunc: any, depth?: number): any;
  remoteToLocal(
    maybeFuncDescriptor: any,
    callRemote: (id: string, ...args: any[]) => void,
    depth?: number
  ): any;
  call(id: string, ...args: any[]): any;
}

/**
 * 表示插件主机。
 */
export interface IPluginHost {
  listen(): void;
  initPlugin(id: string, code: string): Promise<void>;
  activatePlugin(): Promise<void>;
  deactivatePlugin(): Promise<void>;
  dispose(): void;
}

/**
 * 表示 API 代理。
 */
export interface IApiProxy {
  [key: string]: (...args: any[]) => Promise<any>;
}

/**
 * 表示函数代理描述符。
 */
export interface IFunctionProxyDescriptor {
  __type: "function-proxy";
  id: string;
}

export interface IPluginService {
  loadPlugin(id: string, code: string): Promise<void>;
  activatePlugin(id: string): Promise<void>;
  deactivatePlugin(id: string): Promise<void>;
}

export interface ICommunicationService {
  send(message: IMessageData): void;
  onReceive(handler: (message: IMessageData) => void): () => void;
}

export interface IFunctionProxyService {
  wrapFunction(func: Function): IFunctionProxyDescriptor;
  callFunction(id: string, ...args: any[]): any;
}
export type ApiResponse<T = any> = {
  requestId: string;
  data: T;
  error?: string;
};
