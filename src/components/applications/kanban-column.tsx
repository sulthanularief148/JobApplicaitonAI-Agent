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

export function KanbanColumn({
  status,
  applications,
  onEdit,
  onDelete,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      className={`flex w-64 shrink-0 flex-col rounded-lg bg-muted/50 ${
        isOver ? 'ring-2 ring-primary/50' : ''
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2">
        <h3 className="text-sm font-semibold">{STATUS_LABELS[status]}</h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
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
