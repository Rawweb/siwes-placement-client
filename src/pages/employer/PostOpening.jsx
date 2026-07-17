import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createOpportunity } from '../../api/opportunities.js';
import { ANAMBRA_LGAS, STATE } from '../../utils/location/locations.js';


const disciplineOptions = [
  'Computer Science',
  'Software Engineering',
  'Engineering',
  'Sciences',
  'Accountancy',
  'Media / Communication',
];

export default function PostOpening() {
  const [position, setPosition] = useState('');
  // Selected disciplines as an array, since one opening can target several.
  const [disciplines, setDisciplines] = useState([]);
  const [state] = useState(STATE);
  const [city, setCity] = useState(ANAMBRA_LGAS[0]);
  const [requirements, setRequirements] = useState('');
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  // Toggle a discipline in or out of the selected array.
  const toggleDiscipline = (d) => {
    setDisciplines((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Guard the array before sending, matching the backend rule.
    if (disciplines.length === 0) {
      toast.error('Select at least one discipline.');
      return;
    }

    setSaving(true);
    try {
      await createOpportunity({ position, disciplines, requirements, state, city });
      toast.success('Opening posted');
      navigate('/employer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not post the opening.');
    } finally {
      setSaving(false);
    }
  };

  const labelClass = 'text-sm font-semibold text-[var(--color-ink)] flex flex-col gap-1';
  const inputClass =
    'font-normal border border-[var(--color-line)] rounded-lg px-3 py-2.5 text-sm bg-white';

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h1 className='text-lg font-bold text-[var(--color-ink)]'>Post a Placement Opening</h1>
        <p className='text-sm text-[var(--color-ink-soft)]'>Visible to students once published</p>
      </div>

      <div className='bg-white border border-[var(--color-line)] rounded-lg p-5'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <label className={labelClass}>
            Position title
            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder='e.g. Software Development Intern'
              className={inputClass}
              required
            />
          </label>

          {/* Disciplines as toggle chips, producing an array. */}
          <div className={labelClass}>
            Required disciplines
            <div className='flex flex-wrap gap-2 mt-1'>
              {disciplineOptions.map((d) => {
                const on = disciplines.includes(d);
                return (
                  <button
                    key={d}
                    type='button'
                    onClick={() => toggleDiscipline(d)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                      on
                        ? 'bg-[var(--color-green-700)] text-white border-[var(--color-green-700)]'
                        : 'bg-white text-[var(--color-ink-soft)] border-[var(--color-line)]'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          <label className={labelClass}>
            State
            <input value={STATE} disabled className={`${inputClass} opacity-70`} />
          </label>
          <label className={labelClass}>
            City / LGA
            <select value={city} onChange={(e) => setCity(e.target.value)} className={inputClass}>
              {ANAMBRA_LGAS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Requirements &amp; description
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows='4'
              placeholder='Tasks the intern will handle, number of slots, and what you expect from applicants'
              className={inputClass}
              required
            />
          </label>

          <div className='flex gap-2'>
            <button
              type='submit'
              disabled={saving}
              className='rounded-lg bg-[var(--color-green-700)] text-white text-sm font-semibold px-5 py-2.5 disabled:opacity-60'
            >
              {saving ? 'Publishing...' : 'Publish opening'}
            </button>
            <button
              type='button'
              onClick={() => navigate('/employer/dashboard')}
              className='rounded-lg border border-[var(--color-line)] text-sm font-semibold px-5 py-2.5'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
