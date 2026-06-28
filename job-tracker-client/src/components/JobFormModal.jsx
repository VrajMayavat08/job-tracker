import { useState } from 'react';
import api from '../api/axios';

function JobFormModal({ onClose, onJobAdded }) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Applied');
  const [notes, setNotes] = useState('');
  const [appliedDate, setAppliedDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/jobs', {
        company,
        role,
        status,
        notes,
        appliedDate: appliedDate || undefined,
      });
      onJobAdded(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
      <div className="w-full max-w-md bg-[#0F1219] border border-[var(--color-glass-border)] rounded-2xl p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-[var(--font-display)] text-lg">Add application</h2>
          <button onClick={onClose} className="text-[var(--color-text-secondary)] hover:text-white text-sm">
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-[var(--color-rose)]/10 border border-[var(--color-rose)]/30 text-[var(--color-rose-light)] text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-[var(--color-text-secondary)] block mb-1">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="w-full bg-white/5 border border-[var(--color-glass-border)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-violet)]"
            />
          </div>

          <div>
            <label className="text-xs text-[var(--color-text-secondary)] block mb-1">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full bg-white/5 border border-[var(--color-glass-border)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-violet)]"
            />
          </div>

          <div>
            <label className="text-xs text-[var(--color-text-secondary)] block mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-white/5 border border-[var(--color-glass-border)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-violet)]"
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-[var(--color-text-secondary)] block mb-1">Applied date</label>
            <input
              type="date"
              value={appliedDate}
              onChange={(e) => setAppliedDate(e.target.value)}
              className="w-full bg-white/5 border border-[var(--color-glass-border)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-violet)]"
            />
          </div>

          <div>
            <label className="text-xs text-[var(--color-text-secondary)] block mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="w-full bg-white/5 border border-[var(--color-glass-border)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-violet)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-violet)] hover:bg-[var(--color-violet-light)] text-white text-sm font-medium rounded-lg py-2 mt-2 transition-colors"
          >
            {loading ? 'Adding...' : 'Add application'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default JobFormModal;