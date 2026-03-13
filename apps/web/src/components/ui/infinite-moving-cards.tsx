import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ThemeCard {
  name: string;
  bg: string;
  type: string;
}

interface InfiniteMovingCardsProps {
  items: ThemeCard[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}

export function InfiniteMovingCards({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: InfiniteMovingCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  const addAnimation = () => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  };

  const getDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      const durationMap = {
        fast: "20s",
        normal: "40s",
        slow: "80s",
      };
      containerRef.current.style.setProperty(
        "--animation-duration",
        durationMap[speed]
      );
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-6 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className="relative w-[350px] max-w-full flex-shrink-0"
          >
            <div
              className={`aspect-[4/3] rounded-[2rem] p-6 ${item.bg} shadow-sm border border-slate-200/20 transition-transform duration-500 hover:scale-[1.02] hover:shadow-xl`}
            >
              <div className="w-full h-full rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 p-4 flex flex-col gap-4">
                <div className="w-1/3 h-6 rounded-md bg-black/10" />
                <div className="space-y-2 mt-auto">
                  <div className="w-full h-4 rounded-md bg-black/5" />
                  <div className="w-4/5 h-4 rounded-md bg-black/5" />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center mt-4">
              <span className="font-bold text-slate-800">{item.name}</span>
              <span className="text-sm text-slate-500">{item.type}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
