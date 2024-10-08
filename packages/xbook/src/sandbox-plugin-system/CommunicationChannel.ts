import { ICommunicationChannel, IMessageData } from "@playground/plugin-host";

export class WebWorkerCommunicationChannel implements ICommunicationChannel {
  constructor(private worker: Worker) {}
  send(message: IMessageData): void {
    this.worker.postMessage(message);
  }
  onReceive(
    handler: (message: IMessageData) => void,
    options?: boolean | AddEventListenerOptions
  ): () => void {
    const wrappedHandler = (event: MessageEvent) => {
      handler(event.data);
    };
    this.worker.addEventListener("message", wrappedHandler, options);
    return () => this.worker.removeEventListener("message", wrappedHandler);
  }
}
