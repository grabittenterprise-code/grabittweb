"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type ProductBottleProps = {
  className?: string;
  rotate?: boolean;
};

export function ProductBottle({ className = "", rotate = false }: ProductBottleProps) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springX = useSpring(rotateX, { stiffness: 120, damping: 18, mass: 0.3 });
  const springY = useSpring(rotateY, { stiffness: 120, damping: 18, mass: 0.3 });

  const tiltX = useTransform(springX, [-40, 40], [10, -10]);
  const tiltY = useTransform(springY, [-40, 40], [-12, 12]);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;
    rotateX.set(y);
    rotateY.set(x);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      className={`relative mx-auto aspect-[4/5] w-full max-w-[26rem] [perspective:1200px] ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={rotate ? { y: [0, -10, 0], rotateZ: [0, 1.2, 0, -1.2, 0] } : undefined}
      transition={rotate ? { duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } : undefined}
    >
      <motion.div
        className="absolute inset-x-[16%] top-[7%] h-[15%] rounded-t-[1.4rem] rounded-b-[0.9rem] border border-white/10 bg-[linear-gradient(180deg,#141414_0%,#050505_100%)] shadow-[0_20px_30px_rgba(0,0,0,0.45)]"
        style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-x-[20%] top-[18%] h-[18%] rounded-full bg-white/4" />
        <div className="absolute inset-y-0 left-[18%] w-[8%] bg-white/12 blur-sm" />
      </motion.div>
      <motion.div
        className="absolute inset-x-[7%] bottom-[2%] top-[19%] overflow-hidden rounded-[2.7rem] border border-white/10 bg-[linear-gradient(170deg,#0f0f0f_0%,#020202_40%,#141414_100%)] shadow-[0_35px_80px_rgba(0,0,0,0.6)]"
        style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.16),transparent_24%),radial-gradient(circle_at_72%_20%,rgba(255,255,255,0.06),transparent_30%),linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.035)_48%,rgba(255,255,255,0)_100%)]" />
        <div className="absolute inset-y-[12%] left-[14%] w-[10%] rounded-full bg-white/12 blur-md" />
        <div className="absolute inset-y-[18%] right-[12%] w-[6%] rounded-full bg-white/8 blur-lg" />
        <div className="absolute inset-x-[14%] top-[19%] h-px shine-line" />
        <div className="absolute inset-y-[8%] right-[7%] w-px bg-gradient-to-b from-transparent via-white/25 to-transparent" />
        <div className="absolute inset-x-0 top-[28%] px-[16%] text-center">
          <p className="font-serif text-[clamp(1.8rem,4vw,3rem)] tracking-[0.25em] text-white">GRABITT</p>
          <p className="mt-2 text-[0.55rem] uppercase tracking-[0.6em] text-white/55 sm:text-xs">
            Natural Inner Beauty
          </p>
        </div>
        <div className="absolute inset-x-[16%] bottom-[17%] rounded-[1.5rem] border border-white/10 bg-white/[0.02] px-5 py-6 backdrop-blur-sm">
          <p className="text-center text-[0.6rem] uppercase tracking-[0.38em] text-white/68 sm:text-xs">
            Luxury Black Face Wash
          </p>
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <p className="mt-4 text-center text-[0.65rem] leading-6 text-white/60 sm:text-sm">
            Deep cleanse. Hydrate. Protect.
          </p>
        </div>
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 mx-auto h-16 w-[72%] rounded-full bg-white/10 blur-3xl" />
    </motion.div>
  );
}
