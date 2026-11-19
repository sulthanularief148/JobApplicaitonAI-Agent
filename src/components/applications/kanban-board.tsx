'use client';

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useState } from 'react';
import type { Application, ApplicationStatus } from '@/lib/types/application';
import { APPLICATION_STATUSES } from '@/lib/types/application';
import { KanbanColumn } from './kanban-column';
import { ApplicationCard } from './application-card';

interface KanbanBoardProps {
  applications: Application[];
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
}

export function KanbanBoard({
  applications,
  onStatusChange,
  onEdit,
  onDelete,
}: KanbanBoardProps) {
  const [activeApp, setActiveApp] = useState<Application | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const grouped = APPLICATION_STATUSES.reduce(
    (acc, status) => {
      acc[status] = applications.filter((a) => a.status === status);
      return acc;
    },
    {} as Record<ApplicationStatus, Application[]>
  );

  function handleDragStart(event: DragStartEvent) {
    const app = applications.find((a) => a.id === event.active.id);
    setActiveApp(app ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveApp(null);
    const { active, over } = event;
    if (!over) return;

    const appId = active.id as string;
    const app = applications.find((a) => a.id === appId);
    if (!app) return;

    // Dropped over a column (droppable id = status)
    const newStatus = over.id as ApplicationStatus;
    if (APPLICATION_STATUSES.includes(newStatus) && newStatus !== app.status) {
      onStatusChange(appId, newStatus);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {APPLICATION_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            applications={grouped[status]}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      <DragOverlay>
        {activeApp && (
          <ApplicationCard
            application={activeApp}
            onEdit={() => {}}
            onDelete={() => {}}
            overlay
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
