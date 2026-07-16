import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerRequest } from '../../api/auth.js';
import { useAuth } from '../../hooks/useAuth.js';

// Dropdown options, kept here so the JSX stays clean.
const courses = [
  'Computer Science',
  'Electrical Engineering',
  'Microbiology',
  'Accountancy',
  'Mass Communication',
];
const levels = ['300 Level', '400 Level', '500 Level', 'ND II', 'HND I'];
const states = ['Anambra', 'Enugu', 'Lagos', 'Abuja (FCT)', 'Rivers'];
const cities = ['Awka South', 'Awka North', 'Onitsha North', 'Nnewi North'];
const disciplineOptions = [
  'Computer Science / IT',
  'Engineering',
  'Sciences / Laboratory',
  'Business / Accounting',
  'Media / Communication',
];

export default function Register() {
  // Which role tab is active.
  const [role, setRole] = useState('student');

  // Shared fields.
  const [shared, setShared] = useState({ fullName: '', email: '', password: '' });

  // Student-only fields, pre-filled with the first dropdown option.
  const [student, setStudent] = useState({
    courseOfStudy: courses[0],
    academicLevel: levels[0],
    state: states[0],
    city: cities[0],
  });

  // Employer-only fields.
  const [employer, setEmployer] = useState({
    organisationName: '',
    disciplines: disciplineOptions[0],
    state: states[0],
    city: cities[0],
    about: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleShared = (e) => setShared({ ...shared, [e.target.name]: e.target.value });
  const handleStudent = (e) => setStudent({ ...student, [e.target.name]: e.target.value });
  const handleEmployer = (e) => setEmployer({ ...employer, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Assemble the request shaped for the chosen role.
    const payload = { ...shared, role };
    if (role === 'student') {
      payload.studentProfile = student;
    } else {
      // disciplines must be an array on the backend, so wrap the choice.
      payload.employerProfile = { ...employer, disciplines: [employer.disciplines] };
    }

    try {
      const res = await registerRequest(payload);
      const { token, user } = res.data;

      login(user, token);

      if (user.role === 'student') navigate('/student/browse');
      else navigate('/employer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Small reusable class strings to avoid repeating them on every input.
  const labelClass = 'text-sm font-semibold text-[var(--color-ink)] flex flex-col gap-1';
  const inputClass = 'font-normal border border-[var(--color-line)] rounded-lg px-3 py-2.5 text-sm';

  return (
    <div className='min-h-screen grid place-items-center bg-[var(--color-paper)] px-4 py-8'>
      <div className='w-full max-w-md bg-white border border-[var(--color-line)] rounded-2xl p-7'>
        <div className='w-8 h-8 rounded-lg bg-[var(--color-green-700)] grid place-items-center text-white font-bold font-serif mb-3'>
          S
        </div>
        <h1 className='font-serif text-2xl text-[var(--color-green-900)] mb-1'>
          Create your account
        </h1>
        <p className='text-sm text-[var(--color-ink-soft)] mb-4'>Choose your role to begin.</p>

        {/* Role toggle */}
        <div className='flex border border-[var(--color-line)] rounded-lg overflow-hidden mb-4'>
          <button
            type='button'
            onClick={() => setRole('student')}
            className={`flex-1 py-2 text-sm ${role === 'student' ? 'bg-[var(--color-green-700)] text-white font-bold' : 'text-[var(--color-ink-soft)]'}`}
          >
            Student
          </button>
          <button
            type='button'
            onClick={() => setRole('employer')}
            className={`flex-1 py-2 text-sm ${role === 'employer' ? 'bg-[var(--color-green-700)] text-white font-bold' : 'text-[var(--color-ink-soft)]'}`}
          >
            Employer
          </button>
        </div>

        {error && (
          <div className='mb-4 rounded-lg bg-[var(--color-red-100)] text-[var(--color-red-600)] text-sm px-3 py-2'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          {/* Student fields */}
          {role === 'student' && (
            <>
              <label className={labelClass}>
                Full name
                <input
                  name='fullName'
                  value={shared.fullName}
                  onChange={handleShared}
                  placeholder='e.g. Adaeze Okonkwo'
                  className={inputClass}
                />
              </label>
              <div className='grid grid-cols-2 gap-3'>
                <label className={labelClass}>
                  Course of study
                  <select
                    name='courseOfStudy'
                    value={student.courseOfStudy}
                    onChange={handleStudent}
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
                    value={student.academicLevel}
                    onChange={handleStudent}
                    className={inputClass}
                  >
                    {levels.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <label className={labelClass}>
                  State
                  <select
                    name='state'
                    value={student.state}
                    onChange={handleStudent}
                    className={inputClass}
                  >
                    {states.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label className={labelClass}>
                  City / LGA
                  <select
                    name='city'
                    value={student.city}
                    onChange={handleStudent}
                    className={inputClass}
                  >
                    {cities.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
            </>
          )}

          {/* Employer fields */}
          {role === 'employer' && (
            <>
              <label className={labelClass}>
                Organisation name
                <input
                  name='organisationName'
                  value={employer.organisationName}
                  onChange={handleEmployer}
                  placeholder='e.g. NovaTech Solutions Ltd'
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Disciplines you can host
                <select
                  name='disciplines'
                  value={employer.disciplines}
                  onChange={handleEmployer}
                  className={inputClass}
                >
                  {disciplineOptions.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </label>
              <div className='grid grid-cols-2 gap-3'>
                <label className={labelClass}>
                  State
                  <select
                    name='state'
                    value={employer.state}
                    onChange={handleEmployer}
                    className={inputClass}
                  >
                    {states.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label className={labelClass}>
                  City / LGA
                  <select
                    name='city'
                    value={employer.city}
                    onChange={handleEmployer}
                    className={inputClass}
                  >
                    {cities.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className={labelClass}>
                About the organisation
                <textarea
                  name='about'
                  value={employer.about}
                  onChange={handleEmployer}
                  rows='3'
                  placeholder='What your organisation does and the kind of tasks interns handle'
                  className={inputClass}
                />
              </label>
            </>
          )}

          {/* Shared fields, always shown */}
          <label className={labelClass}>
            Email address
            <input
              type='email'
              name='email'
              value={shared.email}
              onChange={handleShared}
              placeholder='you@example.com'
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Password
            <input
              type='password'
              name='password'
              value={shared.password}
              onChange={handleShared}
              placeholder='At least 8 characters'
              className={inputClass}
            />
          </label>

          <button
            type='submit'
            disabled={loading}
            className='mt-1 rounded-lg bg-[var(--color-green-700)] text-white text-sm font-semibold py-3 disabled:opacity-60'
          >
            {loading
              ? 'Creating account...'
              : role === 'student'
                ? 'Create student account'
                : 'Create employer account'}
          </button>

          {role === 'employer' && (
            <p className='text-xs text-[var(--color-ink-soft)]'>
              Your account will be reviewed by a SIWES coordinator before your openings become
              visible to students.
            </p>
          )}
        </form>

        <p className='text-center text-sm text-[var(--color-ink-soft)] mt-4'>
          Already registered?{' '}
          <Link to='/login' className='text-[var(--color-green-700)] font-semibold'>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
