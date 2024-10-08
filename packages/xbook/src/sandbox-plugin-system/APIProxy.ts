export class APIRegistry {
  private apiMethods: Map<string, Function> = new Map();

  registerAPI(name: string, implementation: Function): void {
    if (this.apiMethods.has(name)) {
      console.warn(`API method '${name}' is being overwritten.`);
    }
    this.apiMethods.set(name, implementation);
  }

  async callAPI(name: string, args: any[]): Promise<any> {
    // console.log("call api", name, args);
    const method = this.apiMethods.get(name);
    if (!method) {
      throw new Error(`API method '${name}' is not registered.`);
    }
    try {
      return await method(...args);
    } catch (error) {
      console.error(`Error calling API method '${name}':`, error);
      throw error;
    }
  }

  getRegisteredAPIs(): string[] {
    return Array.from(this.apiMethods.keys());
  }

  unregisterAPI(name: string): boolean {
    return this.apiMethods.delete(name);
  }

  clearAPIs(): void {
    this.apiMethods.clear();
  }
}