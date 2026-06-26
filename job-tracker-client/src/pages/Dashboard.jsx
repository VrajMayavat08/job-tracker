import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-deep)] px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-[var(--font-display)] text-xl">Job tracker</h1>
            <p className="text-[var(--color-text-secondary)] text-sm">
              {jobs.length} applications in flight
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            Log out
          </button>
        </div>

        {loading ? (
          <p className="text-[var(--color-text-secondary)] text-sm">Loading...</p>
        ) : jobs.length === 0 ? (
          <p className="text-[var(--color-text-secondary)] text-sm">No applications yet.</p>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-[var(--color-glass)] border border-[var(--color-glass-border)] rounded-xl p-4"
              >
                <p className="text-sm font-medium">{job.company}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">{job.role}</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">{job.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;