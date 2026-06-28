const statusColors = {
  Applied: { border: '#9C8CFF', bg: 'rgba(123,97,255,0.18)', text: '#B6A8FF' },
  Interview: { border: '#F5C56B', bg: 'rgba(245,166,35,0.18)', text: '#F5C56B' },
  Offer: { border: '#6EE7D8', bg: 'rgba(0,217,192,0.18)', text: '#6EE7D8' },
  Rejected: { border: '#F0A0A0', bg: 'rgba(229,91,91,0.18)', text: '#F0A0A0' },
};

function getGroupLabel(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays < 7) return 'This week';
  if (diffDays < 14) return 'Last week';
  if (diffDays < 30) return 'Earlier this month';
  return 'Older';
}

function TimelineView({ jobs }) {
  if (jobs.length === 0) {
    return <p className="text-[var(--color-text-secondary)] text-sm">No applications yet.</p>;
  }

  const sorted = [...jobs].sort(
    (a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)
  );

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Group jobs by recency label, preserving order
  const groups = [];
  sorted.forEach((job) => {
    const label = getGroupLabel(job.appliedDate);
    let group = groups.find((g) => g.label === label);
    if (!group) {
      group = { label, jobs: [] };
      groups.push(group);
    }
    group.jobs.push(job);
  });

  return (
    <div className="glass-card rounded-2xl px-6 md:px-10 py-10">
      <div className="relative max-w-2xl mx-auto">
        {groups.map((group, gi) => (
          <div key={group.label} className="mb-8">
            <p className="font-[var(--font-mono)] text-xs text-[var(--color-text-secondary)] mb-4 uppercase tracking-wide">
              {group.label}
            </p>

            <div className="relative pl-6">
              {/* Vertical line for this group */}
              <div
                className="absolute left-[5px] top-1 bottom-1 w-[2px] rounded-full"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              />

              {group.jobs.map((job, i) => {
                const colors = statusColors[job.status];
                const isMostRecent = gi === 0 && i === 0;

                return (
                  <div key={job._id} className="relative mb-4 last:mb-0">
                    {/* Node */}
                    <div
                      className="absolute left-0 top-1.5 w-3 h-3 rounded-full border-2"
                      style={{
                        background: '#0A0C14',
                        borderColor: colors.border,
                        boxShadow: isMostRecent ? `0 0 10px ${colors.border}` : 'none',
                      }}
                    />

                    {/* Card */}
                    <div className="glass-card rounded-xl px-4 py-3 ml-2 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                            {job.company}
                          </p>
                          <span
                            className="font-[var(--font-mono)] text-[9px] px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ background: colors.bg, color: colors.text }}
                          >
                            {job.status}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--color-text-secondary)] truncate">
                          {job.role}
                        </p>
                      </div>
                      <p className="font-[var(--font-mono)] text-[10px] text-[var(--color-text-secondary)] flex-shrink-0">
                        {formatDate(job.appliedDate)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimelineView;