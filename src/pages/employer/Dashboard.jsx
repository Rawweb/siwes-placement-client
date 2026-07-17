import { useState, useEffect } from 'react';
import { getMyOpportunities } from '../../api/opportunities.js';
import { getReceivedApplications } from '../../api/applications.js';

export default function Dashboard() {
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch both in parallel: openings and received applications.
        const [oppRes, appRes] = await Promise.all([
          getMyOpportunities(),
          getReceivedApplications(),
        ]);
        setOpportunities(oppRes.data.opportunities);
        setApplications(appRes.data.applications);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load your dashboard.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Derived counts for the stat cards.
  const activeOpenings = opportunities.length;
  const totalApplications = applications.length;
  const acceptedCount = applications.filter((a) => a.status === 'Accepted').length;

  if (loading) {
    return <p className='text-sm text-[var(--color-ink-soft)]'>Loading your dashboard...</p>;
  }

  if (error) {
    return (
      <div className='rounded-lg bg-[var(--color-red-100)] text-[var(--color-red-600)] text-sm px-3 py-2'>
        {error}
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h1 className='text-lg font-bold text-[var(--color-ink)]'>Dashboard</h1>
        <p className='text-sm text-[var(--color-ink-soft)]'>
          Your openings and applications at a glance
        </p>
      </div>

      {/* Stat cards */}
      <div className='grid grid-cols-3 gap-3'>
        {[
          { n: activeOpenings, l: 'Active openings' },
          { n: totalApplications, l: 'Applications received' },
          { n: acceptedCount, l: 'Interns accepted' },
        ].map((s) => (
          <div key={s.l} className='bg-white border border-[var(--color-line)] rounded-lg p-4'>
            <div className='font-serif text-2xl text-[var(--color-green-900)]'>{s.n}</div>
            <div className='text-[11.5px] text-[var(--color-ink-soft)] mt-0.5'>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Openings list */}
      <div className='bg-white border border-[var(--color-line)] rounded-lg p-4'>
        <h3 className='text-sm font-bold mb-3'>Your openings</h3>
        {opportunities.length === 0 ? (
          <p className='text-sm text-[var(--color-ink-soft)]'>
            You have not posted any openings yet.
          </p>
        ) : (
          <div className='flex flex-col'>
            {opportunities.map((opp) => {
              const count = applications.filter(
                (a) => a.opportunity?._id === opp._id || a.opportunity === opp._id,
              ).length;
              return (
                <div
                  key={opp._id}
                  className='flex items-center justify-between gap-3 py-3 border-b border-[var(--color-line)] last:border-0'
                >
                  <div>
                    <b className='text-sm'>{opp.position}</b>
                    <div className='text-xs text-[var(--color-ink-soft)]'>
                      {opp.city}, {opp.state}
                    </div>
                    <div className='flex gap-1.5 flex-wrap mt-1'>
                      {opp.disciplines.map((d) => (
                        <span
                          key={d}
                          className='bg-[var(--color-green-100)] text-[var(--color-green-900)] text-[11px] font-semibold px-2 py-0.5 rounded-full'
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className='text-xs text-[var(--color-ink-soft)] shrink-0'>
                    {count} application{count === 1 ? '' : 's'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
