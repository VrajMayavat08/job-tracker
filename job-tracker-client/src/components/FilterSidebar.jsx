const statuses = ['Applied', 'Interview', 'Offer', 'Rejected'];

function FilterSidebar({ search, setSearch, statusFilter, setStatusFilter, counts }) {
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-6 h-fit">
      {/* Stats */}
      <div>
        <p className="font-[var(--font-mono)] text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wide mb-3">
          Overview
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/5 rounded-lg px-3 py-2">
            <p className="font-[var(--font-mono)] text-lg font-medium">{counts.total}</p>
            <p className="text-[10px] text-[var(--color-text-secondary)]">total</p>
          </div>
          <div className="bg-white/5 rounded-lg px-3 py-2">
            <p className="font-[var(--font-mono)] text-lg font-medium" style={{ color: '#B6A8FF' }}>{counts.Applied}</p>
            <p className="text-[10px] text-[var(--color-text-secondary)]">applied</p>
          </div>
          <div className="bg-white/5 rounded-lg px-3 py-2">
            <p className="font-[var(--font-mono)] text-lg font-medium" style={{ color: '#F5C56B' }}>{counts.Interview}</p>
            <p className="text-[10px] text-[var(--color-text-secondary)]">interview</p>
          </div>
          <div className="bg-white/5 rounded-lg px-3 py-2">
            <p className="font-[var(--font-mono)] text-lg font-medium" style={{ color: '#6EE7D8' }}>{counts.Offer}</p>
            <p className="text-[10px] text-[var(--color-text-secondary)]">offer</p>
          </div>
        </div>
      </div>

      <div className="h-px bg-white/10" />

      {/* Search */}
      <div>
        <label className="text-xs text-[var(--color-text-secondary)] block mb-2">Search</label>
        <input
          type="text"
          placeholder="Company name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-[var(--color-glass-border)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-violet)]"
        />
      </div>

      {/* Status filter */}
      <div>
        <label className="text-xs text-[var(--color-text-secondary)] block mb-2">Status</label>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => setStatusFilter('All')}
            className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === 'All' ? 'bg-white/10 text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-white/5'
            }`}
          >
            All
          </button>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === s ? 'bg-white/10 text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-white/5'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterSidebar;