import { useNavigate } from 'react-router-dom';

// Data for the three role cards. Mapping over this avoids repeating
// the same markup three times.
const roleCards = [
  {
    title: 'For Students',
    points: [
      'Create a profile with your course, level and location',
      'Search and filter openings by discipline and location',
      'Apply online and track every application status',
    ],
  },
  {
    title: 'For Employers',
    points: [
      'Register your organisation and get verified',
      'Post openings with discipline requirements',
      'Review applicant profiles, accept or decline',
    ],
  },
  {
    title: 'For Coordinators',
    points: [
      'Verify employers before openings go live',
      'Monitor placement status across all students',
      'Manage placement records from one dashboard',
    ],
  },
];

// Data for the five "how it works" steps.
const steps = [
  { label: '1 · Register', text: 'Students and employers create their profiles.' },
  { label: '2 · Verify', text: 'The coordinator verifies each employer.' },
  { label: '3 · Post', text: 'Verified employers publish their openings.' },
  { label: '4 · Apply', text: 'Students filter, choose and apply.' },
  { label: '5 · Track', text: 'Decisions update instantly for everyone.' },
];

export default function Landing() {
  // useNavigate gives us a function to change pages on button click.
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-[var(--color-paper)]'>
      {/* Header */}
      <header className='flex items-center gap-3 bg-white border-b border-[var(--color-line)] px-6 py-4'>
        <div className='w-8 h-8 rounded-lg bg-[var(--color-green-700)] grid place-items-center text-white font-bold font-serif'>
          S
        </div>
        <span className='font-bold text-[var(--color-ink)]'>SIWES Placement System</span>
        <div className='ml-auto flex gap-2'>
          <button
            onClick={() => navigate('/login')}
            className='rounded-lg border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]'
          >
            Log in
          </button>
          <button
            onClick={() => navigate('/register')}
            className='rounded-lg bg-[var(--color-green-700)] px-4 py-2 text-sm font-semibold text-white'
          >
            Create account
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className='text-center px-6 py-14'>
        <p className='text-xs tracking-widest uppercase font-bold text-[var(--color-green-700)] mb-4'>
          Local Internship &amp; SIWES Placement
        </p>
        <h1 className='font-serif text-3xl md:text-4xl text-[var(--color-green-900)] max-w-2xl mx-auto mb-4 leading-tight'>
          Find a placement that matches your course, close to home.
        </h1>
        <p className='text-[var(--color-ink-soft)] max-w-xl mx-auto mb-6 leading-relaxed'>
          One platform where students discover and apply for local, course-relevant SIWES
          opportunities, employers post openings directly, and coordinators monitor placement
          progress in real time.
        </p>
        <div className='flex gap-3 justify-center flex-wrap'>
          <button
            onClick={() => navigate('/register')}
            className='rounded-lg bg-[var(--color-green-700)] px-5 py-2.5 text-sm font-semibold text-white'
          >
            Get started
          </button>
          <button
            onClick={() => navigate('/login')}
            className='rounded-lg border border-[var(--color-line)] px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)]'
          >
            Log in
          </button>
        </div>
      </section>

      {/* Role cards */}
      <section className='grid md:grid-cols-3 gap-4 px-6 pb-8 max-w-5xl mx-auto'>
        {roleCards.map((card) => (
          <div
            key={card.title}
            className='bg-white border border-[var(--color-line)] rounded-lg p-5'
          >
            <h3 className='font-serif text-lg text-[var(--color-green-900)] mb-3'>{card.title}</h3>
            <ul className='space-y-2'>
              {card.points.map((point) => (
                <li key={point} className='text-sm text-[var(--color-ink-soft)] list-disc ml-4'>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className='px-6 pb-12 max-w-5xl mx-auto'>
        <h2 className='font-serif text-xl text-[var(--color-green-900)] text-center mb-4'>
          How placement works here
        </h2>
        <div className='grid md:grid-cols-5 gap-3'>
          {steps.map((step) => (
            <div
              key={step.label}
              className='bg-white border border-[var(--color-line)] rounded-lg p-3'
            >
              <p className='font-semibold text-[var(--color-ink)] text-sm mb-1'>{step.label}</p>
              <p className='text-xs text-[var(--color-ink-soft)] leading-relaxed'>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-[var(--color-line)] px-6 py-4 text-center text-xs text-[var(--color-ink-soft)]'>
        Department of Computer Science · Nnamdi Azikiwe University, Awka
      </footer>
    </div>
  );
}
