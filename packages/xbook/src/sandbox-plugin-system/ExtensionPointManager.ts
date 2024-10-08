export class ExtensionPointManager {
  private extensionPoints: Map<string, Set<Function>> = new Map();

  registerExtensionPoint(name: string, callback: Function): void {
    if (!this.extensionPoints.has(name)) {
      this.extensionPoints.set(name, new Set());
    }
    this.extensionPoints.get(name)!.add(callback);
  }

  unregisterExtensionPoint(name: string, callback: Function): void {
    const callbacks = this.extensionPoints.get(name);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  executeExtensionPoint(name: string, ...args: any[]): void {
    const callbacks = this.extensionPoints.get(name);
    if (callbacks) {
      for (const callback of Array.from(callbacks)) {
        callback(...args);
      }
    }
  }
}
