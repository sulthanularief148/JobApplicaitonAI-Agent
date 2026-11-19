'use client';

import type { Application, ApplicationStatus } from '@/lib/types/application';
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/types/application';
import { motion } from 'framer-motion';
import { Trash2, Pencil, MapPin, TrendingUp } from 'lucide-react';

interface ApplicationTableProps {
  applications: Application[];
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}

export function ApplicationTable({
  applications,
  onEdit,
  onDelete,
  onStatusChange,
}: ApplicationTableProps) {
  if (applications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card rounded-xl border border-dashed border-glass-border p-16 text-center text-muted-foreground"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <TrendingUp className="h-7 w-7 text-primary" />
        </div>
        <p className="font-medium">No applications yet</p>
        <p className="mt-1 text-sm">Click &quot;Add Application&quot; or analyze a job to get started.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card overflow-hidden rounded-xl"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-glass-border">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Location</th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Match</th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Applied</th>
              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, i) => (
              <motion.tr
                key={app.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="group border-b border-glass-border last:border-0 hover:bg-primary/5 transition-colors duration-200"
              >
                <td className="px-5 py-4">
                  <span className="font-medium">{app.role}</span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{app.company}</td>
                <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">
                  {app.location ? (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {app.location}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-5 py-4">
                  <select
                    value={app.status}
                    onChange={(e) =>
                      onStatusChange(app.id, e.target.value as ApplicationStatus)
                    }
                    className={`rounded-full border px-3 py-1 text-xs font-semibold cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 ${STATUS_COLORS[app.status]}`}
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  {app.match_score != null ? (
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted/50">
                        <div
                          className={`h-full rounded-full ${
                            app.match_score >= 70
                              ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                              : app.match_score >= 40
                                ? 'bg-gradient-to-r from-amber-400 to-yellow-500'
                                : 'bg-gradient-to-r from-red-400 to-rose-500'
                          }`}
                          style={{ width: `${app.match_score}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold">{app.match_score}%</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-5 py-4 text-muted-foreground hidden lg:table-cell">
                  {app.applied_date
                    ? new Date(app.applied_date).toLocaleDateString()
                    : '—'}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <motion.button
                      onClick={() => onEdit(app)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="rounded-lg p-2 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                    >
                      <Pencil className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => onDelete(app.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="rounded-lg p-2 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
