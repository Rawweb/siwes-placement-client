import { useState, useEffect } from 'react';
import { getMyApplications } from '../../api/applications.js';

// Maps each status to its badge colours, matching the mockup.
const statusStyles = {
  Pending: 'bg-[#EDEFEA] text-[#5A625E]',
  'Under Review': 'bg-[var(--color-amber-100)] text-[var(--color-amber-600)]',
  Accepted: 'bg-[var(--color-green-100)] text-[var(--color-green-700)]',
  Declined: 'bg-[var(--color-red-100)] text-[var(--color-red-600)]',
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyApplications();
        setApplications(res.data.applications);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load your applications.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Formats a date like "12 Jul 2026".
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h1 className='text-lg font-bold text-[var(--color-ink)]'>My Applications</h1>
        <p className='text-sm text-[var(--color-ink-soft)]'>
          Track every application from submission to decision
        </p>
      </div>

      {loading && (
        <p className='text-sm text-[var(--color-ink-soft)]'>Loading your applications...</p>
      )}

      {error && (
        <div className='rounded-lg bg-[var(--color-red-100)] text-[var(--color-red-600)] text-sm px-3 py-2'>
          {error}
        </div>
      )}

      {!loading && !error && applications.length === 0 && (
        <div className='bg-white border border-[var(--color-line)] rounded-lg p-8 text-center text-sm text-[var(--color-ink-soft)]'>
          You have not applied to any opportunities yet.
        </div>
      )}

      {!loading && !error && applications.length > 0 && (
        <div className='bg-white border border-[var(--color-line)] rounded-lg overflow-hidden'>
          {/* Desktop table header */}
          <div className='hidden sm:grid grid-cols-[1.4fr_1.4fr_1fr_1fr] gap-2 px-4 py-2.5 border-b border-[var(--color-line)] text-[11px] uppercase tracking-wide text-[var(--color-ink-soft)]'>
            <span>Organisation</span>
            <span>Position</span>
            <span>Applied</span>
            <span>Status</span>
          </div>

          {applications.map((app) => (
            <div
              key={app._id}
              className='grid grid-cols-1 sm:grid-cols-[1.4fr_1.4fr_1fr_1fr] gap-1 sm:gap-2 px-4 py-3 border-b border-[var(--color-line)] last:border-0 text-sm'
            >
              <span className='font-semibold sm:font-normal'>
                {app.opportunity?.employer?.employerProfile?.organisationName || 'Employer'}
              </span>
              <span className='text-[var(--color-ink-soft)] sm:text-[var(--color-ink)]'>
                {app.opportunity?.position || 'Opportunity'}
              </span>
              <span className='text-[var(--color-ink-soft)]'>{formatDate(app.createdAt)}</span>
              <span>
                <span
                  className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${statusStyles[app.status] || ''}`}
                >
                  {app.status}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
