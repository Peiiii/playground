  export interface IDisposable {
  dispose: () => void;
}

export class Disposable {
  protected disposables: { dispose: () => any }[];

  constructor(callOnDispose: () => any = () => {}) {
    this.disposables = [];
    this.disposables.push({ dispose: callOnDispose });
  }

  static from(...disposableLikes: { dispose: () => any }[]): Disposable {
    const disposable = new Disposable(() => {
      for (const item of disposableLikes) {
        item.dispose();
      }
    });

    disposable.disposables.push(...disposableLikes);

    return disposable;
  }

  onDispose(fnOrDisposable: IDisposable | (() => void)): void {
    if (typeof fnOrDisposable === "function") {
      this.disposables.push({ dispose: fnOrDisposable });
    } else {
      this.disposables.push(fnOrDisposable);
    }
  }

  dispose(): void {
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
    this.disposables = [];
  }
}
