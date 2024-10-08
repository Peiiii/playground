import { IRemoteEventBus, MessageType } from "./interfaces";
import { RequestClient } from "./request-client";

const join = (...args: string[]) => args.filter(Boolean).join(".");

export class ApiGateway {
  private requestClient: RequestClient;

  constructor(readonly remoteEventBus: IRemoteEventBus) {
    this.requestClient = new RequestClient(remoteEventBus);
  }

  createApiProxy = (prefix: string = "", rules: Rule[] = []) => {
    return defineAPIProxy(prefix, rules, (method, args) => {
      return this.requestClient.requestRemote(MessageType.ApiCall, {
        method,
        args,
      });
    });
  };
}

export const defineAPIProxy = <T extends Record<string, any>>(
  commonPrefix: string,
  rules: Rule[],
  remoteCall: (method: string, args: any[]) => Promise<any>
): T => {
  const serviceChecker = createChecker(rules);
  const createProxy = (prefix: string) => {
    return new Proxy(
      {},
      {
        get: (_, prop: string) => {
          if (typeof prop !== "string") return undefined;
          const type = serviceChecker.check(prop);
          if (type === "service") {
            return createProxy(join(prefix, prop));
          } else if (type === "function") {
            return async (...args: any[]) => {
              return await remoteCall(join(commonPrefix, prefix, prop), args);
            };
          }
          return undefined;
        },
      }
    );
  };
  return createProxy("") as T;
};

type Rule = { pathPattern: string; check: (path: string) => ApiType };

type ApiType = "service" | "function" | false;

export const createChecker = (rules: Rule[]) => {
  const check = (path: string) => {
    return (
      rules.reduce(
        (acc, rule) =>
          acc ??
          (path.match(new RegExp(rule.pathPattern)) ? rule.check(path) : acc),
        undefined as undefined | ApiType
      ) ?? "function"
    );
  };
  return {
    check,
  };
};
