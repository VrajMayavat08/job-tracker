const statuses = ['Applied', 'Interview', 'Offer', 'Rejected'];

function FilterSidebar({ search, setSearch, statusFilter, setStatusFilter }) {
  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col gap-5">
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