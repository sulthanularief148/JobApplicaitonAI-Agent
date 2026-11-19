'use client';

import { useState, useEffect } from 'react';
import type { Application, ApplicationStatus } from '@/lib/types/application';
import { STATUS_LABELS, APPLICATION_STATUSES } from '@/lib/types/application';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ApplicationModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    company: string;
    role: string;
    location: string;
    status: ApplicationStatus;
    applied_date: string;
    follow_up_date: string;
    notes: string;
  }) => void;
  application?: Application | null;
}

export function ApplicationModal({
  open,
  onClose,
  onSave,
  application,
}: ApplicationModalProps) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('saved');
  const [appliedDate, setAppliedDate] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (application) {
      setCompany(application.company);
      setRole(application.role);
      setLocation(application.location || '');
      setStatus(application.status);
      setAppliedDate(application.applied_date || '');
      setFollowUpDate(application.follow_up_date || '');
      setNotes(application.notes || '');
    } else {
      setCompany('');
      setRole('');
      setLocation('');
      setStatus('saved');
      setAppliedDate('');
      setFollowUpDate('');
      setNotes('');
    }
  }, [application, open]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      company,
      role,
      location,
      status,
      applied_date: appliedDate,
      follow_up_date: followUpDate,
      notes,
    });
  }

  const inputClass =
    'w-full rounded-xl input-premium px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="mx-4 w-full max-w-lg glass-card rounded-2xl p-7 glow-border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold">
              {application ? 'Edit Application' : 'Add Application'}
            </h2>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all"
            >
              <X className="h-5 w-5" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground/80">Role *</label>
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Frontend Engineer"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground/80">Company *</label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground/80">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Remote"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground/80">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                  className={inputClass}
                >
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground/80">Applied Date</label>
                <input
                  type="date"
                  value={appliedDate}
                  onChange={(e) => setAppliedDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground/80">Follow-up Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground/80">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any notes about this application..."
                rows={3}
                className={inputClass}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-xl border border-glass-border px-5 py-2.5 text-sm font-medium hover:bg-muted/50 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all"
              >
                {application ? 'Save Changes' : 'Add Application'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
