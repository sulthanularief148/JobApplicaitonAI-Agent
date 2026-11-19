'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Application, ApplicationStatus } from '@/lib/types/application';
import { KanbanBoard } from '@/components/applications/kanban-board';
import { ApplicationTable } from '@/components/applications/application-table';
import { ApplicationModal } from '@/components/applications/application-modal';
import { motion } from 'framer-motion';
import { LayoutGrid, Table, Plus, Briefcase } from 'lucide-react';
import { JarvisLoader } from '@/components/ui/jarvis-loader';

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <JarvisLoader message="Loading applications..." size={120} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Briefcase className="h-7 w-7 text-primary" />
            Applications
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track your job applications across different stages.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 rounded-xl glass-card p-1">
            <button
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                view === 'kanban'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setView('kanban')}
            >
              <LayoutGrid className="h-4 w-4" />
              Board
            </button>
            <button
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                view === 'table'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setView('table')}
            >
              <Table className="h-4 w-4" />
              Table
            </button>
          </div>
          <motion.button
            onClick={handleAdd}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Application
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
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
      </motion.div>

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
