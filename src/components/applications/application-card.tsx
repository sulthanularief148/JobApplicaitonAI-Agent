'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Application } from '@/lib/types/application';
import { MapPin, Calendar, GripVertical, Trash2 } from 'lucide-react';

interface ApplicationCardProps {
  application: Application;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  overlay?: boolean;
}

export function ApplicationCard({
  application,
  onEdit,
  onDelete,
  overlay,
}: ApplicationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group rounded-xl glass-card p-3.5 transition-all duration-200 ${
        isDragging ? 'opacity-40' : ''
      } ${overlay ? 'shadow-xl ring-2 ring-primary/30 glow-border' : 'hover:border-primary/20'}`}
    >
      <div className="flex items-start gap-2">
        <button
          className="mt-0.5 cursor-grab text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <button
            onClick={() => onEdit(application)}
            className="text-left"
          >
            <p className="font-semibold leading-tight">{application.role}</p>
            <p className="text-sm text-muted-foreground">{application.company}</p>
          </button>

          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {application.location && (
              <span className="flex items-center gap-0.5">
                <MapPin className="h-3 w-3" />
                {application.location}
              </span>
            )}
            {application.applied_date && (
              <span className="flex items-center gap-0.5">
                <Calendar className="h-3 w-3" />
                {new Date(application.applied_date).toLocaleDateString()}
              </span>
            )}
            {application.match_score != null && (
              <span
                className={`rounded-full border px-2 py-0.5 font-semibold ${
                  application.match_score >= 70
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400'
                    : application.match_score >= 40
                      ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400'
                      : 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400'
                }`}
              >
                {application.match_score}%
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(application.id)}
          className="text-muted-foreground opacity-0 transition-all hover:text-red-500 group-hover:opacity-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
