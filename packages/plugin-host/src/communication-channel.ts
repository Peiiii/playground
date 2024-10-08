import { ICommunicationChannel, IMessageData } from "./interfaces";

export class WebWorkerCommunicationChannel implements ICommunicationChannel {
  public send(message: IMessageData): void {
    self.postMessage(message);
  }

  public onReceive(handler: (message: IMessageData) => void, options?: boolean | AddEventListenerOptions): () => void {
    const wrappedHandler = (event: MessageEvent<IMessageData>) => {
      handler(event.data);
    };
    self.addEventListener("message", wrappedHandler, options);
    return () => {
      self.removeEventListener("message", wrappedHandler);
    };
  }
}
