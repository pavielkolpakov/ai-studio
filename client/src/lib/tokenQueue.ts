type FlushCallback = (token: string) => void;

function getDelay(token: string): number {
  const trimmed = token.trim();

  // Longer pause after sentence-ending punctuation
  if (/[.!?]$/.test(trimmed)) return 65;

  // Medium pause after commas, colons, semicolons
  if (/[,;:]$/.test(trimmed)) return 45;

  // Newlines get a slight pause
  if (token.includes("\n")) return 50;

  // Short tokens (1-3 chars) render faster
  if (trimmed.length <= 3) return 15;

  // Default pace
  return 25;
}

export class TokenQueue {
  private queue: string[] = [];
  private flushing = false;
  private onFlush: FlushCallback;
  private done = false;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(onFlush: FlushCallback) {
    this.onFlush = onFlush;
  }

  push(token: string) {
    this.queue.push(token);
    if (!this.flushing) {
      this.startFlushing();
    }
  }

  finish() {
    this.done = true;
  }

  destroy() {
    if (this.timer) clearTimeout(this.timer);
    // Flush remaining tokens immediately
    while (this.queue.length > 0) {
      this.onFlush(this.queue.shift()!);
    }
    this.flushing = false;
  }

  get isDrained(): boolean {
    return this.done && this.queue.length === 0 && !this.flushing;
  }

  private startFlushing() {
    if (this.flushing) return;
    this.flushing = true;
    this.flushNext();
  }

  private flushNext() {
    if (this.queue.length === 0) {
      this.flushing = false;
      return;
    }

    const token = this.queue.shift()!;
    this.onFlush(token);

    const delay = getDelay(token);
    this.timer = setTimeout(() => {
      this.timer = null;
      this.flushNext();
    }, delay);
  }
}
