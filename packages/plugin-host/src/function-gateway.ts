import { IFunctionGateway } from "./interfaces";

export class FunctionGateway implements IFunctionGateway {
  private DEFAULT_DEPTH = 5;
  private funcMap: Map<string, Function> = new Map();
  // private disposableMap: Map<string, Function> = new Map();
  private generateId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  constructor() {}

  localToRemote = (maybeFunc: any, depth: number = this.DEFAULT_DEPTH): any => {
    if (depth <= 0) {
      return maybeFunc;
    }

    if (typeof maybeFunc === "function") {
      const id = this.generateId();
      this.funcMap.set(id, maybeFunc);
      return {
        __type: "function-proxy",
        id,
      };
    }

    if (Array.isArray(maybeFunc)) {
      return maybeFunc.map((item) => this.localToRemote(item, depth - 1));
    }

    if (typeof maybeFunc === "object" && maybeFunc !== null) {
      const result: Record<string, any> = {};
      for (const [key, value] of Object.entries(maybeFunc)) {
        result[key] = this.localToRemote(value, depth - 1);
      }
      return result;
    }

    return maybeFunc;
  };

  isDisposable = (maybeDisposable: any) => {
    return (
      typeof maybeDisposable === "object" &&
      "dispose" in maybeDisposable &&
      typeof maybeDisposable.dispose === "function"
    );
  };

  serializeDisposable = (disposable: any) => {
    if (!this.isDisposable(disposable)) {
      return disposable;
    }
    const id = this.generateId();
    this.funcMap.set(id, disposable.dispose);
    return {
      __type: "disposable",
      disposeFuncId: id,
    };
  };

  deserializeDisposable = (
    serialized: any,
    callRemote: (id: string, ...args: any[]) => void
  ) => {
    if (serialized?.__type !== "disposable") {
      return serialized;
    }
    return {
      dispose: () => callRemote(serialized.disposeFuncId),
    };
  };

  remoteToLocal = (
    maybeFuncDescriptor: any,
    callRemote: (id: string, ...args: any[]) => void,
    depth: number = this.DEFAULT_DEPTH
  ): any => {
    if (depth <= 0) {
      return maybeFuncDescriptor;
    }

    if (maybeFuncDescriptor?.__type === "function-proxy") {
      const func = (...args: any[]) => {
        return callRemote(maybeFuncDescriptor.id, ...args);
      };
      this.funcMap.set(maybeFuncDescriptor.id, func);
      return func;
    }

    if (Array.isArray(maybeFuncDescriptor)) {
      return maybeFuncDescriptor.map((item) =>
        this.remoteToLocal(item, callRemote, depth - 1)
      );
    }

    if (
      typeof maybeFuncDescriptor === "object" &&
      maybeFuncDescriptor !== null
    ) {
      const result: Record<string, any> = {};
      for (const [key, value] of Object.entries(maybeFuncDescriptor)) {
        result[key] = this.remoteToLocal(value, callRemote, depth - 1);
      }
      return result;
    }

    return maybeFuncDescriptor;
  };

  call = (id: string, ...args: any[]) => {
    const func = this.funcMap.get(id);
    if (!func) {
      throw new Error(`Function with id ${id} not found`);
    }
    return func(...args);
  };
}
