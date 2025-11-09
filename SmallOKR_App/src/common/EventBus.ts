class EventBus {
  private events: Record<string, Function[]>;

  constructor() {
    this.events = {};
  }

  // 监听事件
  on(event: string, listener: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  // 触发事件
  emit(event: string, ...args: any[]): void {
    console.log(`Event emitted: ${event}`, ...args);

    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...args));
    }
  }

  // 移除事件监听器
  off(event: string, listener: Function): void {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  // 清除所有事件监听器
  removeAllListeners(event?: string): void {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }
}

export const eventBus = new EventBus();
