import { ApiResponse, IRemoteEventBus, MessageType } from "./interfaces";
import { generateRequestId } from "./utils";

export class RequestClient {
  constructor(private readonly remoteEventBus: IRemoteEventBus) {}
  private pendingRequests = new Map<
    string,
    {
      resolve: (response: ApiResponse) => void;
      reject: (error: any) => void;
    }
  >();
  private unlisten?: () => void;

  private listen() {
    this.unlisten = this.remoteEventBus.onRemote(
      MessageType.ApiResponse,
      (response: ApiResponse) => {
        if (response.error) {
          this.rejectRequest(response.requestId, response.error);
        } else {
          this.resolveRequest(response);
        }
      }
    );
  }

  dispose() {
    this.unlisten?.();
    this.unlisten = undefined;
  }

  private resolveRequest(response: any) {
    const { resolve } = this.pendingRequests.get(response.requestId) || {};
    if (resolve) {
      resolve(response);
    }
  }

  private rejectRequest(requestId: string, error: any) {
    const { reject } = this.pendingRequests.get(requestId) || {};
    if (reject) {
      reject(error);
    }
  }

  requestRemote<T=any>(type: MessageType, data: T) {
    const requestId = generateRequestId();
    return new Promise((resolve, reject) => {
      if (!this.unlisten) {
        this.listen();
      }
      this.pendingRequests.set(requestId, { resolve, reject });
      this.remoteEventBus.emitRemote(type, {
        requestId,
        data,
      });
    });
  }
}
