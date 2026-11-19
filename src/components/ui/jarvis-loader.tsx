'use client';

import { motion } from 'framer-motion';

interface JarvisLoaderProps {
  message?: string;
  size?: number;
}

export function JarvisLoader({ message = 'Analyzing...', size = 200 }: JarvisLoaderProps) {
  const center = size / 2;
  const r1 = size * 0.42;
  const r2 = size * 0.34;
  const r3 = size * 0.26;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-xl"
          style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }}
        />

        <svg width={size} height={size} className="relative z-10">
          {/* Outer ring */}
          <motion.circle
            cx={center}
            cy={center}
            r={r1}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={2}
            strokeDasharray="8 4"
            opacity={0.4}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: 'center' }}
          />

          {/* Middle ring */}
          <motion.circle
            cx={center}
            cy={center}
            r={r2}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={1.5}
            strokeDasharray="20 10 5 10"
            opacity={0.6}
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: 'center' }}
          />

          {/* Inner ring */}
          <motion.circle
            cx={center}
            cy={center}
            r={r3}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray={`${r3 * 1.2} ${r3 * 5.1}`}
            opacity={0.8}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: 'center' }}
          />

          {/* Corner brackets */}
          {[0, 90, 180, 270].map((angle) => (
            <motion.g
              key={angle}
              style={{ transformOrigin: 'center' }}
              animate={{ rotate: angle }}
            >
              <line
                x1={center + r1 + 4}
                y1={center - 8}
                x2={center + r1 + 4}
                y2={center + 8}
                stroke="var(--primary)"
                strokeWidth={2}
                opacity={0.5}
              />
            </motion.g>
          ))}

          {/* Center dot pulse */}
          <motion.circle
            cx={center}
            cy={center}
            r={4}
            fill="var(--primary)"
            animate={{ r: [4, 6, 4], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Scan line */}
          <motion.line
            x1={center - r3}
            y1={center}
            x2={center + r3}
            y2={center}
            stroke="var(--primary)"
            strokeWidth={1}
            opacity={0.4}
            animate={{ y1: [center - r3, center + r3], y2: [center - r3, center + r3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-primary"
            style={{
              left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 6)}%`,
              top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 6)}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Message */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.p
          className="text-sm font-medium text-primary"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
}
