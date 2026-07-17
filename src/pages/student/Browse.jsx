import { useState, useEffect } from 'react';
import { browseOpportunities } from '../../api/opportunities.js';
import { applyToOpportunity, getMyApplications } from '../../api/applications.js';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import { ANAMBRA_LGAS } from '../../utils/location/locations.js';

// Filter dropdown options. "All" means no filter for that field.
const disciplineOptions = [
  'All disciplines',
  'Computer Science',
  'Software Engineering',
  'Engineering',
  'Sciences',
  'Accountancy',
];
const cityOptions = ['All locations', ...ANAMBRA_LGAS];

export default function Browse() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appliedIds, setAppliedIds] = useState([]);
  // Holds the opening the student is about to apply to (or null).
  const [confirmTarget, setConfirmTarget] = useState(null);
  // True while the confirmed apply request is running.
  const [applying, setApplying] = useState(false);

  // The chosen filters. "All..." values mean no filter.
  const [discipline, setDiscipline] = useState('All disciplines');
  const [city, setCity] = useState('All locations');

  // Fetches openings using the current filters.
  const fetchOpportunities = async () => {
    setLoading(true);
    setError('');

    const filters = {};
    if (discipline !== 'All disciplines') filters.discipline = discipline;
    if (city !== 'All locations') filters.city = city;

    try {
      const res = await browseOpportunities(filters);
      setOpportunities(res.data.opportunities);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load opportunities.');
    } finally {
      setLoading(false);
    }
  };

  // Loads which openings the student has already applied to, so the
  // "Applied" state persists across refreshes and page changes.
  const loadAppliedIds = async () => {
    try {
      const res = await getMyApplications();
      // Each application points to an opportunity; collect those ids.
      const ids = res.data.applications.map((a) => a.opportunity?._id).filter(Boolean);
      setAppliedIds(ids);
    } catch {
      // If this fails, buttons just start as "Apply"; not critical.
    }
  };

  // On first load, fetch both openings and existing applications.
  useEffect(() => {
    fetchOpportunities();
    loadAppliedIds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Opening Apply just opens the confirmation for that opening.
  const askApply = (opp) => setConfirmTarget(opp);

  // Runs when the student confirms in the dialog.
  const confirmApply = async () => {
    if (!confirmTarget) return;
    setApplying(true);
    try {
      await applyToOpportunity(confirmTarget._id);
      setAppliedIds((prev) => [...prev, confirmTarget._id]);
      toast.success('Application submitted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit application.');
    } finally {
      setApplying(false);
      setConfirmTarget(null); // close the dialog
    }
  };

  // Fetch once when the page first loads.
  useEffect(() => {
    fetchOpportunities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const labelClass = 'text-sm font-semibold text-[var(--color-ink)] flex flex-col gap-1';
  const inputClass =
    'font-normal border border-[var(--color-line)] rounded-lg px-3 py-2.5 text-sm bg-white';

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h1 className='text-lg font-bold text-[var(--color-ink)]'>Browse Opportunities</h1>
        <p className='text-sm text-[var(--color-ink-soft)]'>Openings from verified employers</p>
      </div>

      {/* Filter bar */}
      <div className='bg-white border border-[var(--color-line)] rounded-lg p-4'>
        <div className='grid sm:grid-cols-3 gap-3 items-end'>
          <label className={labelClass}>
            Discipline
            <select
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              className={inputClass}
            >
              {disciplineOptions.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Location
            <select value={city} onChange={(e) => setCity(e.target.value)} className={inputClass}>
              {cityOptions.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <button
            onClick={fetchOpportunities}
            className='rounded-lg bg-[var(--color-green-700)] text-white text-sm font-semibold py-2.5'
          >
            Apply filters
          </button>
        </div>
      </div>

      {/* Results */}
      {loading && <p className='text-sm text-[var(--color-ink-soft)]'>Loading opportunities...</p>}

      {error && (
        <div className='rounded-lg bg-[var(--color-red-100)] text-[var(--color-red-600)] text-sm px-3 py-2'>
          {error}
        </div>
      )}

      {!loading && !error && opportunities.length === 0 && (
        <div className='bg-white border border-[var(--color-line)] rounded-lg p-8 text-center text-sm text-[var(--color-ink-soft)]'>
          No opportunities match your filters yet. Try widening your search.
        </div>
      )}

      {!loading && !error && opportunities.length > 0 && (
        <div className='grid md:grid-cols-2 gap-4'>
          {opportunities.map((opp) => (
            <div
              key={opp._id}
              className='bg-white border border-[var(--color-line)] rounded-lg p-4 flex flex-col gap-2.5'
            >
              <div className='flex items-center justify-between gap-2'>
                <b className='text-sm'>
                  {opp.employer?.employerProfile?.organisationName || 'Employer'}
                </b>
                <span className='text-[9.5px] font-extrabold tracking-widest uppercase text-[var(--color-green-700)] border border-dashed border-[var(--color-green-700)] rounded px-2 py-0.5'>
                  Verified
                </span>
              </div>
              <h3 className='font-serif text-lg text-[var(--color-green-900)]'>{opp.position}</h3>
              <div className='flex gap-1.5 flex-wrap'>
                {opp.disciplines.map((d) => (
                  <span
                    key={d}
                    className='bg-[var(--color-green-100)] text-[var(--color-green-900)] text-[11px] font-semibold px-2 py-0.5 rounded-full'
                  >
                    {d}
                  </span>
                ))}
              </div>
              <div className='text-xs text-[var(--color-ink-soft)]'>
                {opp.city}, {opp.state}
              </div>
              <div className='flex justify-between items-center mt-1'>
                <span className='text-xs text-[var(--color-ink-soft)] line-clamp-1'>
                  {opp.requirements}
                </span>
                <button
                  onClick={() => askApply(opp)}
                  disabled={appliedIds.includes(opp._id)}
                  className='rounded-lg bg-[var(--color-green-700)] text-white text-xs font-semibold px-3 py-1.5 shrink-0 disabled:opacity-60'
                >
                  {appliedIds.includes(opp._id) ? 'Applied' : 'Apply'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmTarget}
        title='Submit application'
        message={
          confirmTarget
            ? `Apply to "${confirmTarget.position}" at ${confirmTarget.employer?.employerProfile?.organisationName || 'this employer'}?`
            : ''
        }
        confirmLabel='Yes, apply'
        onConfirm={confirmApply}
        onCancel={() => setConfirmTarget(null)}
        loading={applying}
      />
    </div>
  );
}
