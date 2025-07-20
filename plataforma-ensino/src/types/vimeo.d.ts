declare global {
  interface Window {
    Vimeo: {
      Player: new (element: HTMLIFrameElement | string, options?: any) => {
        getDuration(): Promise<number>
        getCurrentTime(): Promise<number>
        on(event: string, callback: Function): void
        off(event: string, callback?: Function): void
        play(): Promise<void>
        pause(): Promise<void>
        seekTo(seconds: number): Promise<void>
      }
    }
  }
}

export {}