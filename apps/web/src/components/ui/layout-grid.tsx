import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface LayoutGridCard {
  id: number;
  content: React.ReactNode;
  className?: string;
  thumbnail?: string;
}

interface LayoutGridProps {
  cards: LayoutGridCard[];
  className?: string;
}

export function LayoutGrid({ cards, className }: LayoutGridProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto px-6",
        className
      )}
    >
      {cards.map((card) => (
        <motion.div
          key={card.id}
          layoutId={`card-${card.id}`}
          onClick={() => setSelectedId(selectedId === card.id ? null : card.id)}
          className={cn(
            "relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 border-2 border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg",
            card.className
          )}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {card.thumbnail && (
            <div className="absolute inset-0">
              <img
                src={card.thumbnail}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          )}
          <div className={cn(
            "relative z-10 flex flex-col justify-between p-6",
            card.thumbnail ? "h-full min-h-[280px] text-white" : "h-full min-h-[200px]"
          )}>
            {card.content}
          </div>
        </motion.div>
      ))}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            layoutId={`card-${selectedId}`}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              className="relative max-w-2xl w-full max-h-[90vh] overflow-auto bg-white rounded-2xl p-8"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {cards.find((c) => c.id === selectedId)?.content}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
