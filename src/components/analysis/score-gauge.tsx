'use client';

import { motion } from 'framer-motion';

interface ScoreGaugeProps {
  score: number;
  size?: number;
}

export function ScoreGauge({ score, size = 180 }: ScoreGaugeProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = size / 2;

  const color =
    score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

  const colorClass =
    score >= 70
      ? 'from-emerald-400 to-green-500'
      : score >= 40
        ? 'from-amber-400 to-yellow-500'
        : 'from-red-400 to-rose-500';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer glow */}
        <div
          className="absolute inset-4 rounded-full blur-xl opacity-20"
          style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
        />

        <svg width={size} height={size} className="relative z-10">
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity={1} />
              <stop offset="100%" stopColor={color} stopOpacity={0.6} />
            </linearGradient>
          </defs>

          {/* Outer decorative ring */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius + 8}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1}
            strokeDasharray="4 8"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: 'center' }}
          />

          {/* Background ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
            opacity={0.3}
          />

          {/* Score ring */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="-rotate-90"
            style={{ transformOrigin: 'center' }}
          />
        </svg>

        {/* Score number in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`text-5xl font-bold tracking-tight bg-gradient-to-b ${colorClass} bg-clip-text text-transparent`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs font-medium text-muted-foreground mt-0.5">/ 100</span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">Match Score</span>
    </div>
  );
}
