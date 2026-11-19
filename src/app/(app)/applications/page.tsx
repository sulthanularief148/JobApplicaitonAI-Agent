'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Application, ApplicationStatus } from '@/lib/types/application';
import { KanbanBoard } from '@/components/applications/kanban-board';
import { ApplicationTable } from '@/components/applications/application-table';
import { ApplicationModal } from '@/components/applications/application-modal';
import { LayoutGrid, Table, Plus } from 'lucide-react';

type ViewMode = 'kanban' | 'table';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('kanban');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);

  const fetchApplications = useCallback(async () => {
    const res = await fetch('/api/applications');
    if (res.ok) {
      const data = await res.json();
      setApplications(data.applications);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  async function handleSave(data: {
    company: string;
    role: string;
    location: string;
    status: ApplicationStatus;
    applied_date: string;
    follow_up_date: string;
    notes: string;
  }) {
    if (editingApp) {
      const res = await fetch(`/api/applications/${editingApp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const { application } = await res.json();
        setApplications((prev) =>
          prev.map((a) => (a.id === application.id ? { ...a, ...application } : a))
        );
      }
    } else {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const { application } = await res.json();
        setApplications((prev) => [application, ...prev]);
      }
    }
    setModalOpen(false);
    setEditingApp(null);
  }

  async function handleDelete(id: string) {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/applications/${id}`, { method: 'DELETE' });
  }

  function handleEdit(app: Application) {
    setEditingApp(app);
    setModalOpen(true);
  }

  function handleAdd() {
    setEditingApp(null);
    setModalOpen(true);
  }

  const tabClass = (active: boolean) =>
    `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
      active
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
    }`;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">
            Track your job applications across different stages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            <button
              className={tabClass(view === 'kanban')}
              onClick={() => setView('kanban')}
            >
              <LayoutGrid className="h-4 w-4" />
              Board
            </button>
            <button
              className={tabClass(view === 'table')}
              onClick={() => setView('table')}
            >
              <Table className="h-4 w-4" />
              Table
            </button>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Application
          </button>
        </div>
      </div>

      {view === 'kanban' ? (
        <KanbanBoard
          applications={applications}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <ApplicationTable
          applications={applications}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}

      <ApplicationModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingApp(null);
        }}
        onSave={handleSave}
        application={editingApp}
      />
    </div>
  );
}
