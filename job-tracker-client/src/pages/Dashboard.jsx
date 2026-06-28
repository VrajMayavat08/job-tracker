import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AddJobModal from '../components/AddJobModal';
import EditJobModal from '../components/EditJobModal';

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const { logout } = useAuth();
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

  const handleJobAdded = (newJob) => {
    setJobs([newJob, ...jobs]);
  };

  const handleJobUpdated = (updatedJob) => {
    setJobs(jobs.map((j) => (j._id === updatedJob._id ? updatedJob : j)));
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter((j) => j._id !== jobId));
    } catch (err) {
      console.error('Failed to delete job', err);
    }
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[var(--color-violet)] hover:bg-[var(--color-violet-light)] text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
            >
              + Add application
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              Log out
            </button>
          </div>
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
                className="bg-[var(--color-glass)] border border-[var(--color-glass-border)] rounded-xl p-4 flex justify-between items-start"
              >
                <div>
                  <p className="text-sm font-medium">{job.company}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{job.role}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">{job.status}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingJob(job)}
                    className="text-xs text-[var(--color-violet-light)] hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="text-xs text-[var(--color-rose-light)] hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddJobModal
          onClose={() => setShowAddModal(false)}
          onJobAdded={handleJobAdded}
        />
      )}

      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onJobUpdated={handleJobUpdated}
        />
      )}
    </div>
  );
}

export default Dashboard;