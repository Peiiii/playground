import { FunctionGateway } from "./function-gateway";
import {
  ICommunicationChannel,
  IRemoteEventBus,
  IFunctionGateway,
  IMessageData,
  MessageType,
  MessagePayloads,
} from "./interfaces";

export class RemoveEventBus implements IRemoteEventBus {
  private listeners: Map<string, ((...args: any[]) => void)[]> = new Map();

  private unlisten?: () => void;
  private funcGateway: IFunctionGateway = new FunctionGateway();

  constructor(private communicationChannel: ICommunicationChannel) {
    this.unlisten = this.listenRemote();
    // 支持函数映射
    this.onRemote(MessageType.ExecuteCallback, (payload: any) => {
      this.funcGateway.call(payload.id, ...payload.args);
    });
  }

  off<T extends MessageType>(
    event: T,
    listener: (payload: MessagePayloads[T]) => void
  ): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emitRemote<T extends MessageType>(
    event: T,
    payload: MessagePayloads[T]
  ): void {
    this.communicationChannel.send({
      type: event,
      payload: this.funcGateway.localToRemote(payload),
    });
  }

  private callRemote = (id: string, ...args: any[]) => {
    this.communicationChannel.send({
      type: MessageType.ExecuteCallback,
      payload: {
        id,
        args,
      },
    });
  };

  listenRemote() {
    return this.communicationChannel.onReceive((message: IMessageData) => {
      this.emitLocal(
        message.type,
        this.funcGateway.remoteToLocal(message.payload, this.callRemote)
      );
    });
  }

  private emitLocal(event: string, payload: any) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => listener(payload));
    }
  }

  stop() {
    this.unlisten?.();
    this.unlisten = undefined;
  }

  onRemote<T extends MessageType>(
    event: T,
    listener: (payload: MessagePayloads[T]) => void
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(listener);
    return () => {
      this.off(event, listener);
    };
  }
}
