import  { useEffect, useRef } from "react";

interface DotDistortionProps {
  dotSize?: number;
  dotGap?: number;
  mouseInfluenceRadius?: number;
  distortionStrength?: number;
  returnSpeed?: number;
  friction?: number;
  color?: string; 
  className?: string;
  glowStrength?: number;
}

export function DotDistortionShader({
  dotSize = 2,
  dotGap = 20,
  mouseInfluenceRadius = 150,
  distortionStrength = 5,
  returnSpeed = 0.05,
  friction = 0.85,
  color = "#2563eb", // Vibrant throwback blue
  className = "",
  glowStrength = 4,
}: DotDistortionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const mouse = { x: -1000, y: -1000, active: false };

    interface Dot {
      x: number;
      y: number;
      ox: number; 
      oy: number;
      vx: number;
      vy: number;
      opacityBase: number;
      scale: number;
    }

    let dots: Dot[] = [];

    const initDots = () => {
      dots = [];
      const cols = Math.ceil(width / dotGap);
      const rows = Math.ceil(height / dotGap);
      
      const offsetX = (width - cols * dotGap) / 2;
      const offsetY = (height - rows * dotGap) / 2;

      for (let y = -2; y <= rows + 2; y++) {
        for (let x = -2; x <= cols + 2; x++) {
          dots.push({
            x: offsetX + x * dotGap,
            y: offsetY + y * dotGap,
            ox: offsetX + x * dotGap,
            oy: offsetY + y * dotGap,
            vx: 0,
            vy: 0,
            opacityBase: 0.15 + Math.random() * 0.45,
            scale: 1,
          });
        }
      }
    };

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
          width = canvas.width = parent.clientWidth;
          height = canvas.height = parent.clientHeight;
      } else {
          width = canvas.width = window.innerWidth;
          height = canvas.height = window.innerHeight;
      }
      initDots();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const rect = parent.getBoundingClientRect();
      // Calculate mouse relative to the parent container
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    // Attach to parent to catch mouse events passing through
    const parent = canvas.parentElement;
    if (!parent) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    
    // Resize observer
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(parent);
    handleResize();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      dots.forEach((dot) => {
        // Physics: Distort based on mouse proximity
        let force = 0;
        if (mouse.active) {
          const dx = mouse.x - dot.x;
          const dy = mouse.y - dot.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseInfluenceRadius) {
            force = (mouseInfluenceRadius - dist) / mouseInfluenceRadius;
            
            // Push away proportional to distance and strength
            const pushX = (dx / dist) * force * distortionStrength;
            const pushY = (dy / dist) * force * distortionStrength;
            
            dot.vx -= pushX; // Repel
            dot.vy -= pushY; // Repel
            
            // Also scale up nearby dots (twinkle pulse, breathe)
            dot.scale = 1 + (force * 1.5);
          } else {
            dot.scale += (1 - dot.scale) * returnSpeed;
          }
        } else {
          dot.scale += (1 - dot.scale) * returnSpeed;
        }

        // Spring back to original position (Restore force)
        dot.vx += (dot.ox - dot.x) * returnSpeed;
        dot.vy += (dot.oy - dot.y) * returnSpeed;

        // Apply friction
        dot.vx *= friction;
        dot.vy *= friction;

        // Apply velocity
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Draw dot
        const currentAlpha = Math.min(1, dot.opacityBase + (force * 0.5));
        
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotSize * dot.scale, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = currentAlpha;
        
        if (force > 0 && glowStrength > 0) {
            ctx.shadowBlur = glowStrength * force;
            ctx.shadowColor = color;
        } else {
            ctx.shadowBlur = 0;
        }
        
        ctx.fill();
      });
      
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [dotSize, dotGap, mouseInfluenceRadius, distortionStrength, returnSpeed, friction, color, glowStrength]);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full pointer-events-none ${className}`}
    />
  );
}
