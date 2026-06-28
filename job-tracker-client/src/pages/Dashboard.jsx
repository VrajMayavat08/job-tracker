import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AddJobModal from '../components/AddJobModal';
import EditJobModal from '../components/EditJobModal';
import TimelineView from '../components/TimelineView';
import CompanyLogo from '../components/CompanyLogo';
import Greeting from '../components/Greeting';
import FilterSidebar from '../components/FilterSidebar';

const statusColors = {
  Applied: { bg: 'rgba(123,97,255,0.18)', text: '#B6A8FF', border: '#9C8CFF' },
  Interview: { bg: 'rgba(245,166,35,0.18)', text: '#F5C56B', border: '#F5C56B' },
  Offer: { bg: 'rgba(0,217,192,0.18)', text: '#6EE7D8', border: '#6EE7D8' },
  Rejected: { bg: 'rgba(229,91,91,0.18)', text: '#F0A0A0', border: '#F0A0A0' },
};

function daysAgo(dateStr) {
  const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'today';
  if (diff === 1) return '1 day ago';
  return `${diff} days ago`;
}

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [view, setView] = useState('board');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
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

  const handleJobAdded = (newJob) => setJobs([newJob, ...jobs]);
  const handleJobUpdated = (updatedJob) =>
    setJobs(jobs.map((j) => (j._id === updatedJob._id ? updatedJob : j)));

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter((j) => j._id !== jobId));
    } catch (err) {
      console.error('Failed to delete job', err);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.company.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    total: jobs.length,
    Applied: jobs.filter((j) => j.status === 'Applied').length,
    Interview: jobs.filter((j) => j.status === 'Interview').length,
    Offer: jobs.filter((j) => j.status === 'Offer').length,
  };

  const heroJob = filteredJobs.find((j) => j.status === 'Interview') || filteredJobs[0];
  const restJobs = filteredJobs.filter((j) => j._id !== heroJob?._id);
  const heroColors = heroJob ? statusColors[heroJob.status] : null;

  return (
    <div className="min-h-screen bg-[var(--color-bg-deep)] px-6 py-8 relative overflow-hidden">
      <div
        className="absolute w-[420px] h-[420px] rounded-full pointer-events-none glow-blur"
        style={{
          background: 'radial-gradient(circle, rgba(123,97,255,0.18) 0%, rgba(123,97,255,0) 70%)',
          top: '-180px',
          left: '-140px',
        }}
      />
      <div
        className="absolute w-[420px] h-[420px] rounded-full pointer-events-none glow-blur"
        style={{
          background: 'radial-gradient(circle, rgba(0,217,192,0.15) 0%, rgba(0,217,192,0) 70%)',
          bottom: '-200px',
          right: '-140px',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-[var(--font-display)] text-xl">Job tracker</h1>
            <Greeting />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[var(--color-violet)] hover:bg-[var(--color-violet-light)] text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors glow-violet"
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

        {/* View toggle */}
        <div className="flex gap-1 bg-white/5 border border-[var(--color-glass-border)] rounded-lg p-1 w-fit mb-6">
          <button
            onClick={() => setView('board')}
            className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
              view === 'board' ? 'bg-white/10 text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
            }`}
          >
            Board
          </button>
          <button
            onClick={() => setView('timeline')}
            className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
              view === 'timeline' ? 'bg-white/10 text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
            }`}
          >
            Timeline
          </button>
        </div>

        {/* Main layout: sidebar (stats + filters) + content */}
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-5">
          <FilterSidebar
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            counts={counts}
          />

          <div className="min-h-[500px]">
            {loading ? (
              <p className="text-[var(--color-text-secondary)] text-sm">Loading...</p>
            ) : filteredJobs.length === 0 ? (
              <div className="glass-card rounded-2xl p-10 text-center">
                <p className="text-[var(--color-text-secondary)] text-sm">
                  {jobs.length === 0
                    ? "Your tracker is empty — time to start the hunt 🎯"
                    : 'No matches found.'}
                </p>
              </div>
            ) : view === 'board' ? (
              <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-4">
                {/* Hero card — stronger identity */}
                {heroJob && (
                  <div
                    className="glass-card rounded-2xl p-7 relative overflow-hidden"
                    style={{ borderColor: heroColors.border + '40' }}
                  >
                    <div
                      className="absolute top-0 left-0 w-full h-1"
                      style={{ background: `linear-gradient(90deg, ${heroColors.border}, transparent)` }}
                    />
                    <div className="flex items-center gap-3 mb-4">
                      <CompanyLogo company={heroJob.company} size={48} />
                      <div>
                        <span
                          className="text-xs px-3 py-1 rounded-full inline-block mb-1"
                          style={{ background: heroColors.bg, color: heroColors.text }}
                        >
                          {heroJob.status} · most recent
                        </span>
                        <p className="font-[var(--font-mono)] text-[10px] text-[var(--color-text-secondary)]">
                          Applied {daysAgo(heroJob.appliedDate)}
                        </p>
                      </div>
                    </div>
                    <h2 className="font-[var(--font-display)] text-2xl mb-1">{heroJob.company}</h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-4">{heroJob.role}</p>
                    {heroJob.notes ? (
                      <div className="bg-white/5 rounded-lg px-4 py-3 text-sm text-[var(--color-text-secondary)] mb-5">
                        {heroJob.notes}
                      </div>
                    ) : (
                      <div className="bg-white/5 rounded-lg px-4 py-3 text-sm text-[var(--color-text-secondary)] mb-5 italic">
                        No notes added yet.
                      </div>
                    )}
                    <div className="flex gap-4">
                      <button
                        onClick={() => setEditingJob(heroJob)}
                        className="text-xs text-[var(--color-violet-light)] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(heroJob._id)}
                        className="text-xs text-[var(--color-rose-light)] hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                {/* Mini list */}
                <div className="flex flex-col gap-2">
                  {restJobs.map((job) => (
                    <div
                      key={job._id}
                      className="glass-card rounded-xl px-4 py-3 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <CompanyLogo company={job.company} size={28} />
                        <div className="min-w-0">
                          <p className="text-sm truncate">{job.company}</p>
                          <p className="text-xs text-[var(--color-text-secondary)] truncate">{job.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className="font-[var(--font-mono)] text-[10px] px-2 py-0.5 rounded-full"
                          style={{
                            background: statusColors[job.status]?.bg,
                            color: statusColors[job.status]?.text,
                          }}
                        >
                          {job.status}
                        </span>
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
                          Del
                        </button>
                      </div>
                    </div>
                  ))}
                  {restJobs.length === 0 && (
                    <div className="glass-card rounded-xl px-4 py-6 text-center">
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        Nothing else here yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <TimelineView jobs={filteredJobs} />
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddJobModal onClose={() => setShowAddModal(false)} onJobAdded={handleJobAdded} />
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