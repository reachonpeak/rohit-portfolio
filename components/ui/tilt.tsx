'use client';
// Adapted from ibelick / Motion Primitives, retrieved using the official 21st CLI.
// https://21st.dev/@ibelick/components/tilt
import { useRef, type ReactNode } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';

export function Tilt({ children, className = '', rotationFactor = 9 }: { children: ReactNode; className?: string; rotationFactor?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x,{stiffness:180,damping:22}), sy = useSpring(y,{stiffness:180,damping:22});
  const rx = useTransform(sy,[-.5,.5],[rotationFactor,-rotationFactor]);
  const ry = useTransform(sx,[-.5,.5],[-rotationFactor,rotationFactor]);
  const transform = useMotionTemplate`perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  return <motion.div ref={ref} className={className} style={{transformStyle:'preserve-3d',transform:reduce ? 'none' : transform}} onPointerMove={e => {
    if(reduce || e.pointerType !== 'mouse' || !ref.current) return;
    const r=ref.current.getBoundingClientRect();
    x.set((e.clientX-r.left)/r.width-.5);y.set((e.clientY-r.top)/r.height-.5);
  }} onPointerLeave={()=>{x.set(0);y.set(0);}}>{children}</motion.div>;
}
