import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getReceivedApplications, decideApplication } from '../../api/applications.js';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import ApplicantModal from '../../components/ui/ApplicantModal.jsx';

const statusStyles = {
  Pending: 'bg-[#EDEFEA] text-[#5A625E]',
  'Under Review': 'bg-[var(--color-amber-100)] text-[var(--color-amber-600)]',
  Accepted: 'bg-[var(--color-green-100)] text-[var(--color-green-700)]',
  Declined: 'bg-[var(--color-red-100)] text-[var(--color-red-600)]',
};

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // The decision the employer is about to confirm: { app, status } or null.
  const [pendingDecision, setPendingDecision] = useState(null);
  const [deciding, setDeciding] = useState(false);

  // The application whose profile is being viewed, or null.
  const [viewing, setViewing] = useState(null);

  const load = async () => {
    try {
      const res = await getReceivedApplications();
      setApplications(res.data.applications);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const askDecide = (app, status) => setPendingDecision({ app, status });

  const confirmDecide = async () => {
    if (!pendingDecision) return;
    setDeciding(true);
    try {
      await decideApplication(pendingDecision.app._id, pendingDecision.status);
      // Update the row locally so the badge changes without a full refetch.
      setApplications((prev) =>
        prev.map((a) =>
          a._id === pendingDecision.app._id ? { ...a, status: pendingDecision.status } : a,
        ),
      );
      toast.success(`Application ${pendingDecision.status.toLowerCase()}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update the application.');
    } finally {
      setDeciding(false);
      setPendingDecision(null);
    }
  };

  if (loading) {
    return <p className='text-sm text-[var(--color-ink-soft)]'>Loading applications...</p>;
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
        <h1 className='text-lg font-bold text-[var(--color-ink)]'>Applications</h1>
        <p className='text-sm text-[var(--color-ink-soft)]'>Review and decide on applicants</p>
      </div>

      {applications.length === 0 ? (
        <div className='bg-white border border-[var(--color-line)] rounded-lg p-8 text-center text-sm text-[var(--color-ink-soft)]'>
          No applications received yet.
        </div>
      ) : (
        <div className='bg-white border border-[var(--color-line)] rounded-lg p-4'>
          {applications.map((app) => {
            const initials = app.student?.fullName
              ?.split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <div
                key={app._id}
                className='flex flex-wrap gap-3 items-center py-3 border-b border-[var(--color-line)] last:border-0'
              >
                {/* Avatar */}
                <div className='w-9 h-9 rounded-full bg-[var(--color-green-100)] text-[var(--color-green-700)] grid place-items-center text-xs font-bold shrink-0'>
                  {initials}
                </div>

                {/* Details */}
                <div className='flex-1 min-w-[160px]'>
                  <b className='text-sm'>{app.student?.fullName || 'Applicant'}</b>
                  <div className='text-xs text-[var(--color-ink-soft)]'>
                    {app.student?.studentProfile?.courseOfStudy} ·{' '}
                    {app.student?.studentProfile?.academicLevel} ·{' '}
                    {app.student?.studentProfile?.city} · for {app.opportunity?.position}
                  </div>
                </div>

                {/* Actions */}
                <div className='flex gap-2 items-center'>
                  <button
                    onClick={() => setViewing(app)}
                    className='rounded-lg border border-[var(--color-line)] text-[var(--color-ink)] text-xs font-semibold px-3 py-1.5'
                  >
                    View profile
                  </button>

                  {app.status === 'Pending' || app.status === 'Under Review' ? (
                    <>
                      {/* Mark under review: only for Pending, since an
                          Under Review application is already there. */}
                      {app.status === 'Pending' && (
                        <button
                          onClick={() => askDecide(app, 'Under Review')}
                          className='rounded-lg border border-[var(--color-amber-600)] text-[var(--color-amber-600)] text-xs font-semibold px-3 py-1.5'
                        >
                          Mark under review
                        </button>
                      )}
                      <button
                        onClick={() => askDecide(app, 'Accepted')}
                        className='rounded-lg bg-[var(--color-green-700)] text-white text-xs font-semibold px-3 py-1.5'
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => askDecide(app, 'Declined')}
                        className='rounded-lg bg-white border border-[var(--color-red-600)] text-[var(--color-red-600)] text-xs font-semibold px-3 py-1.5'
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <span
                      className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${statusStyles[app.status]}`}
                    >
                      {app.status}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDecision}
        title={
          pendingDecision?.status === 'Accepted'
            ? 'Accept applicant'
            : pendingDecision?.status === 'Declined'
              ? 'Decline applicant'
              : 'Mark under review'
        }
        message={
          pendingDecision
            ? `${
                pendingDecision.status === 'Accepted'
                  ? 'Accept'
                  : pendingDecision.status === 'Declined'
                    ? 'Decline'
                    : 'Mark under review:'
              } ${pendingDecision.app.student?.fullName} for ${pendingDecision.app.opportunity?.position}?`
            : ''
        }
        confirmLabel={
          pendingDecision?.status === 'Accepted'
            ? 'Yes, accept'
            : pendingDecision?.status === 'Declined'
              ? 'Yes, decline'
              : 'Yes, mark under review'
        }
        onConfirm={confirmDecide}
        onCancel={() => setPendingDecision(null)}
        loading={deciding}
      />

      <ApplicantModal
        open={!!viewing}
        applicant={viewing?.student}
        position={viewing?.opportunity?.position}
        onClose={() => setViewing(null)}
      />
    </div>
  );
}
