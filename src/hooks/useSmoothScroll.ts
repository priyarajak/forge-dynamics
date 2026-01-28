import { useEffect, useRef, useState, useCallback } from 'react';

interface SmoothScrollState {
  scrollY: number;
  virtualScrollY: number;
  scrollVelocity: number;
  scrollProgress: number;
  direction: 'up' | 'down' | 'idle';
}

export const useSmoothScroll = (lerp: number = 0.08) => {
  const [state, setState] = useState<SmoothScrollState>({
    scrollY: 0,
    virtualScrollY: 0,
    scrollVelocity: 0,
    scrollProgress: 0,
    direction: 'idle',
  });

  const targetScrollY = useRef(0);
  const currentScrollY = useRef(0);
  const lastScrollY = useRef(0);
  const rafId = useRef<number>();
  const documentHeight = useRef(0);

  const updateDocumentHeight = useCallback(() => {
    documentHeight.current = Math.max(
      document.body.scrollHeight - window.innerHeight,
      1
    );
  }, []);

  useEffect(() => {
    updateDocumentHeight();

    const handleScroll = () => {
      targetScrollY.current = window.scrollY;
    };

    const handleResize = () => {
      updateDocumentHeight();
    };

    const animate = () => {
      const diff = targetScrollY.current - currentScrollY.current;
      currentScrollY.current += diff * lerp;

      const velocity = currentScrollY.current - lastScrollY.current;
      lastScrollY.current = currentScrollY.current;

      const progress = Math.min(
        Math.max(currentScrollY.current / documentHeight.current, 0),
        1
      );

      let direction: 'up' | 'down' | 'idle' = 'idle';
      if (velocity > 0.5) direction = 'down';
      else if (velocity < -0.5) direction = 'up';

      setState({
        scrollY: targetScrollY.current,
        virtualScrollY: currentScrollY.current,
        scrollVelocity: velocity,
        scrollProgress: progress,
        direction,
      });

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [lerp, updateDocumentHeight]);

  return state;
};

export const useScrollSection = (
  virtualScrollY: number,
  sectionStart: number,
  sectionEnd: number
) => {
  const sectionProgress = Math.min(
    Math.max((virtualScrollY - sectionStart) / (sectionEnd - sectionStart), 0),
    1
  );

  const isActive = virtualScrollY >= sectionStart && virtualScrollY <= sectionEnd;
  const isPast = virtualScrollY > sectionEnd;
  const isFuture = virtualScrollY < sectionStart;

  return { sectionProgress, isActive, isPast, isFuture };
};
