export class Debounce {
  private timer: any;

  constructor(private readonly timeout: number) {}
  call(fn: () => void, immediate: boolean = false) {
    clearTimeout(this.timer);
    if (immediate) {
      fn();
    } else {
      this.timer = setTimeout(() => {
        fn();
      }, this.timeout);
    }
  }
}
