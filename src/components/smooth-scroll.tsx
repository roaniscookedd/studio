'use client';
import { ReactLenis, useLenis } from '@studio-freight/react-lenis';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.07, duration: 1.5, smoothTouch: true }}>
      {children}
    </ReactLenis>
  );
}
