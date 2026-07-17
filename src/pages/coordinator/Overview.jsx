import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getStats, getUnverifiedEmployers, verifyEmployer } from '../../api/coordinator.js';
import { getAllApplications } from '../../api/applications.js';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [employers, setEmployers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // The employer about to be verified (for the confirmation), or null.
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // Loads everything the overview needs, in parallel.
  const loadAll = async () => {
    try {
      const [statsRes, empRes, actRes] = await Promise.all([
        getStats(),
        getUnverifiedEmployers(),
        getAllApplications(),
      ]);
      setStats(statsRes.data);
      setEmployers(empRes.data.employers);
      setActivity(actRes.data.applications);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load the overview.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const confirmVerify = async () => {
    if (!confirmTarget) return;
    setVerifying(true);
    try {
      await verifyEmployer(confirmTarget._id);
      // Remove the verified employer from the queue locally.
      setEmployers((prev) => prev.filter((e) => e._id !== confirmTarget._id));
      // Reduce the pending count in the stat card.
      setStats((prev) => ({ ...prev, pendingEmployers: prev.pendingEmployers - 1 }));
      toast.success('Employer verified');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not verify the employer.');
    } finally {
      setVerifying(false);
      setConfirmTarget(null);
    }
  };

  // Formats a short relative-ish date for the feed.
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

  if (loading) {
    return <p className='text-sm text-[var(--color-ink-soft)]'>Loading overview...</p>;
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
        <h1 className='text-lg font-bold text-[var(--color-ink)]'>Coordinator Overview</h1>
        <p className='text-sm text-[var(--color-ink-soft)]'>SIWES Unit</p>
      </div>

      {/* Stat cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
        {[
          { n: stats.totalStudents, l: 'Registered students', warn: false },
          { n: stats.placed, l: 'Placed', warn: false },
          { n: stats.notPlaced, l: 'Not yet placed', warn: true },
          { n: stats.pendingEmployers, l: 'Employers awaiting verification', warn: true },
        ].map((s) => (
          <div key={s.l} className='bg-white border border-[var(--color-line)] rounded-lg p-4'>
            <div
              className={`font-serif text-2xl ${s.warn ? 'text-[var(--color-amber-600)]' : 'text-[var(--color-green-900)]'}`}
            >
              {s.n}
            </div>
            <div className='text-[11.5px] text-[var(--color-ink-soft)] mt-0.5'>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Verification queue */}
      <div className='bg-white border border-[var(--color-line)] rounded-lg p-4'>
        <h3 className='text-sm font-bold mb-3'>Employer verification queue</h3>
        {employers.length === 0 ? (
          <p className='text-sm text-[var(--color-ink-soft)]'>
            No employers awaiting verification.
          </p>
        ) : (
          <div className='flex flex-col'>
            {employers.map((emp) => (
              <div
                key={emp._id}
                className='flex flex-wrap items-center gap-3 py-3 border-b border-[var(--color-line)] last:border-0'
              >
                <div className='flex-1 min-w-[180px]'>
                  <b className='text-sm'>{emp.employerProfile?.organisationName || emp.fullName}</b>
                  <div className='text-xs text-[var(--color-ink-soft)]'>
                    {emp.employerProfile?.disciplines} · {emp.employerProfile?.city},{' '}
                    {emp.employerProfile?.state} · Submitted {formatDate(emp.createdAt)}
                  </div>
                </div>
                <span className='text-[9.5px] font-extrabold tracking-widest uppercase text-[var(--color-amber-600)] border border-dashed border-[var(--color-amber-600)] rounded px-2 py-0.5'>
                  Awaiting
                </span>
                <button
                  onClick={() => setConfirmTarget(emp)}
                  className='rounded-lg bg-[var(--color-green-700)] text-white text-xs font-semibold px-3 py-1.5'
                >
                  Verify
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity feed */}
      <div className='bg-white border border-[var(--color-line)] rounded-lg p-4'>
        <h3 className='text-sm font-bold mb-3'>Recent application activity</h3>
        {activity.length === 0 ? (
          <p className='text-sm text-[var(--color-ink-soft)]'>No application activity yet.</p>
        ) : (
          <ul className='flex flex-col'>
            {activity.slice(0, 10).map((app) => (
              <li
                key={app._id}
                className='flex justify-between gap-3 py-2.5 border-b border-[var(--color-line)] last:border-0 text-[12.5px] text-[var(--color-ink-soft)]'
              >
                <span>
                  <b className='text-[var(--color-ink)]'>{app.student?.fullName || 'A student'}</b>{' '}
                  applied to{' '}
                  <b className='text-[var(--color-ink)]'>
                    {app.opportunity?.employer?.employerProfile?.organisationName || 'an employer'}
                  </b>{' '}
                  <span className='text-[var(--color-ink-soft)]'>({app.status})</span>
                </span>
                <span className='text-[11px] text-[#9AA39D] shrink-0'>
                  {formatDate(app.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={!!confirmTarget}
        title='Verify employer'
        message={
          confirmTarget
            ? `Verify "${confirmTarget.employerProfile?.organisationName || confirmTarget.fullName}"? Their openings will become visible to students.`
            : ''
        }
        confirmLabel='Yes, verify'
        onConfirm={confirmVerify}
        onCancel={() => setConfirmTarget(null)}
        loading={verifying}
      />
    </div>
  );
}
