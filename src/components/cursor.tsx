// components/CyanCursor.tsx
'use client';

import React, { useEffect, useRef } from 'react';

const CyanCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;

    if (!cursor || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Instant positioning for the dot
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    };

    const animateCursor = () => {
      // Smooth following animation for the main cursor
      const speed = 0.15;
      cursorX += (mouseX - cursorX) * speed;
      cursorY += (mouseY - cursorY) * speed;
      
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      
      requestAnimationFrame(animateCursor);
    };

    const handleMouseEnter = () => {
      cursor.classList.remove('opacity-0');
      cursor.classList.add('opacity-100');
      cursorDot.classList.remove('opacity-0');
      cursorDot.classList.add('opacity-100');
    };

    const handleMouseLeave = () => {
      cursor.classList.remove('opacity-100');
      cursor.classList.add('opacity-0');
      cursorDot.classList.remove('opacity-100');
      cursorDot.classList.add('opacity-0');
    };

    const handleMouseDown = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
    };

    const handleMouseUp = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    };

    const handleElementHover = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.matches('a, button, input, textarea, select, [role="button"], .cursor-pointer')) {
        cursor.classList.add('scale-150', 'border-cyan-300', 'bg-cyan-400/20');
        cursor.classList.remove('border-cyan-400/80', 'bg-cyan-400/10');
        cursor.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.5)';
      }
    };

    const handleElementLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.matches('a, button, input, textarea, select, [role="button"], .cursor-pointer')) {
        cursor.classList.remove('scale-150', 'border-cyan-300', 'bg-cyan-400/20');
        cursor.classList.add('border-cyan-400/80', 'bg-cyan-400/10');
        cursor.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
      }
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleElementHover);
    document.addEventListener('mouseout', handleElementLeave);

    // Start animation
    animateCursor();

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseout', handleElementLeave);
    };
  }, []);

  return (
    <>
      {/* Main cursor circle */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] w-8 h-8 border-2 border-cyan-400/80 rounded-full bg-cyan-400/10 opacity-0 transition-all duration-300 ease-out shadow-[0_0_20px_rgba(0,255,255,0.3)]"
        style={{
          left: '0px',
          top: '0px',
          transform: 'translate(-50%, -50%)',
        }}
      />
      
      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        className="fixed pointer-events-none z-[9999] w-1 h-1 bg-cyan-400 rounded-full opacity-0 transition-all duration-100 ease-out shadow-[0_0_10px_rgba(0,255,255,0.8)]"
        style={{
          left: '0px',
          top: '0px',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </>
  );
};

export default CyanCursor;