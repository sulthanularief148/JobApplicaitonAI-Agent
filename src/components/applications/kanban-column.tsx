'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Application, ApplicationStatus } from '@/lib/types/application';
import { STATUS_LABELS } from '@/lib/types/application';
import { ApplicationCard } from './application-card';

interface KanbanColumnProps {
  status: ApplicationStatus;
  applications: Application[];
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
}

const COLUMN_ACCENTS: Record<ApplicationStatus, string> = {
  saved: 'border-t-slate-400/50',
  applied: 'border-t-blue-400/50',
  interview: 'border-t-amber-400/50',
  offer: 'border-t-emerald-400/50',
  rejected: 'border-t-red-400/50',
};

export function KanbanColumn({
  status,
  applications,
  onEdit,
  onDelete,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      className={`flex w-64 shrink-0 flex-col rounded-xl glass-card border-t-2 transition-all duration-300 ${COLUMN_ACCENTS[status]} ${
        isOver ? 'ring-2 ring-primary/30 bg-primary/5' : ''
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-sm font-semibold">{STATUS_LABELS[status]}</h3>
        <span className="rounded-full bg-muted/50 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
          {applications.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2"
        style={{ minHeight: 100 }}
      >
        <SortableContext
          items={applications.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
