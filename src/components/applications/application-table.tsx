'use client';

import type { Application, ApplicationStatus } from '@/lib/types/application';
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/types/application';
import { Trash2, Pencil } from 'lucide-react';

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
      <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
        No applications yet. Click &quot;Add Application&quot; or analyze a job
        to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">Role</th>
            <th className="px-4 py-3 text-left font-medium">Company</th>
            <th className="px-4 py-3 text-left font-medium">Location</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Match</th>
            <th className="px-4 py-3 text-left font-medium">Applied</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr
              key={app.id}
              className="border-b last:border-0 hover:bg-muted/30"
            >
              <td className="px-4 py-3 font-medium">{app.role}</td>
              <td className="px-4 py-3 text-muted-foreground">{app.company}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {app.location || '—'}
              </td>
              <td className="px-4 py-3">
                <select
                  value={app.status}
                  onChange={(e) =>
                    onStatusChange(app.id, e.target.value as ApplicationStatus)
                  }
                  className={`rounded-full px-2.5 py-1 text-xs font-medium border-0 cursor-pointer ${STATUS_COLORS[app.status]}`}
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3">
                {app.match_score != null ? (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      app.match_score >= 70
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : app.match_score >= 40
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}
                  >
                    {app.match_score}%
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {app.applied_date
                  ? new Date(app.applied_date).toLocaleDateString()
                  : '—'}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(app)}
                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(app.id)}
                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
