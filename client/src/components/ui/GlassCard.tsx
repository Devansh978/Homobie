// components/ui/GlassCard.tsx
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variants?: any;
}

export const GlassCard = ({
  className,
  variants,
  children,
  ...props
}: GlassCardProps) => {
  return (
    <motion.div
      className={cn(
        "relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-2xl",
        "shadow-[0_8px_30px_rgba(255,255,255,0.05)]",
        className,
      )}
      variants={variants}
      whileHover={{ y: -5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
