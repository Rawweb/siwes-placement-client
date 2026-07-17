import { useState, useEffect } from 'react';
import { getPlacements } from '../../api/coordinator.js';

export default function PlacementRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter controls.
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPlacements();
        setRecords(res.data.records);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load placement records.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filter the already-fetched records in the browser.
  const filtered = records.filter((r) => {
    // Status filter.
    if (statusFilter === 'Placed' && r.status !== 'Placed') return false;
    if (statusFilter === 'Not yet placed' && r.status !== 'Not yet placed') return false;
    // Search filter, matches name (case-insensitive).
    if (search && !r.fullName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const labelClass = 'text-sm font-semibold text-[var(--color-ink)] flex flex-col gap-1';
  const inputClass =
    'font-normal border border-[var(--color-line)] rounded-lg px-3 py-2.5 text-sm bg-white';

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h1 className='text-lg font-bold text-[var(--color-ink)]'>Placement Records</h1>
        <p className='text-sm text-[var(--color-ink-soft)]'>
          Live placement status of every registered student
        </p>
      </div>

      {/* Filters */}
      <div className='bg-white border border-[var(--color-line)] rounded-lg p-4'>
        <div className='grid sm:grid-cols-[1.6fr_1fr] gap-3 items-end'>
          <label className={labelClass}>
            Search student
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search by name'
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Status
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={inputClass}
            >
              <option>All</option>
              <option>Placed</option>
              <option>Not yet placed</option>
            </select>
          </label>
        </div>
      </div>

      {loading && <p className='text-sm text-[var(--color-ink-soft)]'>Loading records...</p>}

      {error && (
        <div className='rounded-lg bg-[var(--color-red-100)] text-[var(--color-red-600)] text-sm px-3 py-2'>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className='bg-white border border-[var(--color-line)] rounded-lg overflow-hidden'>
          {/* Desktop header */}
          <div className='hidden sm:grid grid-cols-[1.4fr_1.2fr_1.4fr_1fr] gap-2 px-4 py-2.5 border-b border-[var(--color-line)] text-[11px] uppercase tracking-wide text-[var(--color-ink-soft)]'>
            <span>Student</span>
            <span>Course</span>
            <span>Organisation</span>
            <span>Status</span>
          </div>

          {filtered.length === 0 ? (
            <p className='px-4 py-8 text-center text-sm text-[var(--color-ink-soft)]'>
              No students match your search.
            </p>
          ) : (
            filtered.map((r) => (
              <div
                key={r.id}
                className='grid grid-cols-1 sm:grid-cols-[1.4fr_1.2fr_1.4fr_1fr] gap-1 sm:gap-2 px-4 py-3 border-b border-[var(--color-line)] last:border-0 text-sm'
              >
                <span className='font-semibold sm:font-normal'>{r.fullName}</span>
                <span className='text-[var(--color-ink-soft)] sm:text-[var(--color-ink)]'>
                  {r.courseOfStudy}
                </span>
                <span className='text-[var(--color-ink-soft)] sm:text-[var(--color-ink)]'>
                  {r.organisation || '—'}
                </span>
                <span>
                  <span
                    className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      r.status === 'Placed'
                        ? 'bg-[var(--color-green-100)] text-[var(--color-green-700)]'
                        : 'bg-[#EDEFEA] text-[#5A625E]'
                    }`}
                  >
                    {r.status}
                  </span>
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
