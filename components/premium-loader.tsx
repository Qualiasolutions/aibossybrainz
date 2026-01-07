"use client";

import { motion } from "framer-motion";

interface PremiumLoaderProps {
  message?: string;
  showLogo?: boolean;
}

export function PremiumLoader({
  message = "Loading your executive team...",
  showLogo = true
}: PremiumLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-amber-950/10" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo with glow effect */}
        {showLogo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 blur-3xl opacity-30 gold-gradient rounded-full scale-150" />

            {/* Logo text */}
            <h1 className="relative text-4xl font-bold gold-text tracking-tight">
              Alecci Media
            </h1>
          </motion.div>
        )}

        {/* Premium spinner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          {/* Outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full border-2 border-amber-500/20"
          >
            {/* Gradient arc */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0deg, rgba(245, 158, 11, 0.8) 60deg, transparent 120deg)',
                maskImage: 'radial-gradient(transparent 55%, black 55%)',
                WebkitMaskImage: 'radial-gradient(transparent 55%, black 55%)'
              }}
            />
          </motion.div>

          {/* Inner pulsing dot */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50" />
          </motion.div>
        </motion.div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground"
        >
          {message}
        </motion.p>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 200 }}
          transition={{ delay: 0.3 }}
          className="h-1 rounded-full bg-white/5 overflow-hidden"
        >
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-full w-1/2 gold-gradient rounded-full"
          />
        </motion.div>
      </div>
    </div>
  );
}

// Mini loader for inline use
export function MiniLoader({ className = "" }: { className?: string }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`w-5 h-5 rounded-full border-2 border-amber-500/20 border-t-amber-500 ${className}`}
    />
  );
}

// Skeleton with shimmer effect
export function PremiumSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-white/5 ${className}`}>
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </div>
  );
}

// Card skeleton
export function CardSkeleton() {
  return (
    <div className="p-4 glass-dark rounded-xl space-y-3">
      <PremiumSkeleton className="h-4 w-3/4" />
      <PremiumSkeleton className="h-4 w-1/2" />
      <PremiumSkeleton className="h-20 w-full" />
    </div>
  );
}

// Message skeleton
export function MessageSkeleton() {
  return (
    <div className="flex gap-3 p-4">
      <PremiumSkeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <PremiumSkeleton className="h-4 w-24" />
        <PremiumSkeleton className="h-4 w-full" />
        <PremiumSkeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

// Sidebar item skeleton
export function SidebarItemSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <PremiumSkeleton className="h-4 w-4 rounded" />
      <PremiumSkeleton className="h-4 flex-1" />
    </div>
  );
}
