import { useEffect, useRef, useCallback } from 'react';

export interface AnimationState {
  scrollY: number;
  virtualScrollY: number;
  scrollVelocity: number;
  scrollProgress: number;
  mouseX: number;
  mouseY: number;
  time: number;
}

type FrameCallback = (state: AnimationState) => void;

class AnimationLoop {
  private callbacks: Set<FrameCallback> = new Set();
  private rafId: number | null = null;
  private state: AnimationState = {
    scrollY: 0,
    virtualScrollY: 0,
    scrollVelocity: 0,
    scrollProgress: 0,
    mouseX: 0,
    mouseY: 0,
    time: 0,
  };

  private targetScrollY = 0;
  private lastScrollY = 0;
  private documentHeight = 1;
  private lerp = 0.06;

  constructor() {
    if (typeof window !== 'undefined') {
      this.updateDocumentHeight();
      window.addEventListener('scroll', this.handleScroll, { passive: true });
      window.addEventListener('resize', this.handleResize, { passive: true });
      window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
      this.start();
    }
  }

  private handleScroll = () => {
    this.targetScrollY = window.scrollY;
  };

  private handleResize = () => {
    this.updateDocumentHeight();
  };

  private handleMouseMove = (e: MouseEvent) => {
    this.state.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    this.state.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  };

  private updateDocumentHeight() {
    this.documentHeight = Math.max(
      document.body.scrollHeight - window.innerHeight,
      1
    );
  }

  private tick = () => {
    const diff = this.targetScrollY - this.state.virtualScrollY;
    this.state.virtualScrollY += diff * this.lerp;

    this.state.scrollVelocity = this.state.virtualScrollY - this.lastScrollY;
    this.lastScrollY = this.state.virtualScrollY;

    this.state.scrollY = this.targetScrollY;
    this.state.scrollProgress = Math.min(
      Math.max(this.state.virtualScrollY / this.documentHeight, 0),
      1
    );
    this.state.time = performance.now();

    this.callbacks.forEach((cb) => cb(this.state));

    this.rafId = requestAnimationFrame(this.tick);
  };

  start() {
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  subscribe(callback: FrameCallback) {
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }

  getState(): AnimationState {
    return this.state;
  }

  destroy() {
    this.stop();
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('resize', this.handleResize);
      window.removeEventListener('mousemove', this.handleMouseMove);
    }
    this.callbacks.clear();
  }
}

// Singleton instance
let loopInstance: AnimationLoop | null = null;

function getLoop(): AnimationLoop {
  if (!loopInstance) {
    loopInstance = new AnimationLoop();
  }
  return loopInstance;
}

export const useAnimationLoop = (callback: FrameCallback) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const loop = getLoop();
    const unsubscribe = loop.subscribe((state) => callbackRef.current(state));
    return unsubscribe;
  }, []);
};

export const useAnimationState = () => {
  const stateRef = useRef<AnimationState>({
    scrollY: 0,
    virtualScrollY: 0,
    scrollVelocity: 0,
    scrollProgress: 0,
    mouseX: 0,
    mouseY: 0,
    time: 0,
  });

  useAnimationLoop((state) => {
    stateRef.current = state;
  });

  return stateRef;
};

export const getHeroProgress = (virtualScrollY: number): number => {
  const heroHeight = typeof window !== 'undefined' ? window.innerHeight * 3 : 3000;
  return Math.min(Math.max(virtualScrollY / heroHeight, 0), 1);
};
