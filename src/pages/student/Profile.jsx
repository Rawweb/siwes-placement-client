import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getMe, updateMyProfile } from '../../api/auth.js';
import { ANAMBRA_LGAS, STATE } from '../../utils/location/locations.js';


const courses = [
  'Computer Science',
  'Electrical Engineering',
  'Microbiology',
  'Accountancy',
  'Mass Communication',
];
const levels = ['300 Level', '400 Level', '500 Level', 'ND II', 'HND I'];

export default function Profile() {
  const [form, setForm] = useState(null); // null until loaded
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load the student's current profile into the form on mount.
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMe();
        const u = res.data.user;
        setFullName(u.fullName);
        setEmail(u.email);
        setForm({
          courseOfStudy: u.studentProfile?.courseOfStudy || courses[0],
          academicLevel: u.studentProfile?.academicLevel || levels[0],
          state: STATE,
          city: u.studentProfile?.city || ANAMBRA_LGAS[0],
          skills: u.studentProfile?.skills || '',
        });
      } catch {
        toast.error('Could not load your profile.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMyProfile({ studentProfile: form });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  const labelClass = 'text-sm font-semibold text-[var(--color-ink)] flex flex-col gap-1';
  const inputClass =
    'font-normal border border-[var(--color-line)] rounded-lg px-3 py-2.5 text-sm bg-white';

  if (loading) {
    return <p className='text-sm text-[var(--color-ink-soft)]'>Loading your profile...</p>;
  }

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h1 className='text-lg font-bold text-[var(--color-ink)]'>My Profile</h1>
        <p className='text-sm text-[var(--color-ink-soft)]'>Employers see this when you apply</p>
      </div>

      <div className='bg-white border border-[var(--color-line)] rounded-lg p-5'>
        <form onSubmit={handleSave} className='flex flex-col gap-3'>
          <div className='grid sm:grid-cols-2 gap-3'>
            {/* Name and email shown but not editable here. */}
            <label className={labelClass}>
              Full name
              <input value={fullName} disabled className={`${inputClass} opacity-70`} />
            </label>
            <label className={labelClass}>
              Email
              <input value={email} disabled className={`${inputClass} opacity-70`} />
            </label>
          </div>

          <div className='grid sm:grid-cols-2 gap-3'>
            <label className={labelClass}>
              Course of study
              <select
                name='courseOfStudy'
                value={form.courseOfStudy}
                onChange={handleChange}
                className={inputClass}
              >
                {courses.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Academic level
              <select
                name='academicLevel'
                value={form.academicLevel}
                onChange={handleChange}
                className={inputClass}
              >
                {levels.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </label>
          </div>

          <div className='grid sm:grid-cols-2 gap-3'>
            <label className={labelClass}>
              State
              <input value={STATE} disabled className={`${inputClass} opacity-70`} />
            </label>
            <label className={labelClass}>
              City / LGA
              <select name='city' value={form.city} onChange={handleChange} className={inputClass}>
                {ANAMBRA_LGAS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>

          <label className={labelClass}>
            Skills summary
            <textarea
              name='skills'
              value={form.skills}
              onChange={handleChange}
              rows='3'
              className={inputClass}
            />
          </label>

          <div>
            <button
              type='submit'
              disabled={saving}
              className='rounded-lg bg-[var(--color-green-700)] text-white text-sm font-semibold px-5 py-2.5 disabled:opacity-60'
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
