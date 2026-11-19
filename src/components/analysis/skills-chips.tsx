'use client';

// Colored skill chips — green for matched, red for missing.

interface SkillsChipsProps {
  matched: string[];
  missing: string[];
}

export function SkillsChips({ matched, missing }: SkillsChipsProps) {
  return (
    <div className="space-y-4">
      {matched.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium">Matched Skills</h3>
          <div className="flex flex-wrap gap-2">
            {matched.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      {missing.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium">Missing Skills</h3>
          <div className="flex flex-wrap gap-2">
            {missing.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
