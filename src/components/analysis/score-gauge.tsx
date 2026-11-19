'use client';

// Circular score gauge — shows the match score as a ring with percentage.
// Color changes based on score: red < 40, yellow < 70, green >= 70.

interface ScoreGaugeProps {
  score: number;
  size?: number;
}

export function ScoreGauge({ score, size = 160 }: ScoreGaugeProps) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 70
      ? 'text-green-500'
      : score >= 40
        ? 'text-yellow-500'
        : 'text-red-500';

  const strokeColor =
    score >= 70
      ? 'stroke-green-500'
      : score >= 40
        ? 'stroke-yellow-500'
        : 'stroke-red-500';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90"
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
          />
          {/* Score ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${strokeColor} transition-all duration-1000`}
          />
        </svg>
        {/* Score number in the center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-4xl font-bold ${color}`}>{score}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">Match Score</span>
    </div>
  );
}
