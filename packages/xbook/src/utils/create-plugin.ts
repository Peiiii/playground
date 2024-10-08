import { Xbook } from "..";

export const createPlugin = (plugin: (context: Xbook) => void) => {
  return plugin;
};
