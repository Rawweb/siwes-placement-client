import { Routes, Route } from 'react-router-dom';
import PublicRoute from './components/PublicRoute.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Placeholder from './pages/Placeholder.jsx';
import NotFound from './pages/NotFound.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import StudentLayout from './components/StudentLayout.jsx';
import Browse from './pages/student/Browse.jsx';
import MyApplications from './pages/student/MyApplications.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public pages: logged-in users get bounced to their dashboard. */}
      <Route
        path='/'
        element={
          <PublicRoute>
            <Landing />
          </PublicRoute>
        }
      />
      <Route
        path='/login'
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path='/register'
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Student area: one guard, one layout, wrapping all student pages. */}
      <Route
        path='/student'
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path='browse' element={<Browse />} />
        <Route path='applications' element={<MyApplications />} />
        <Route path='profile' element={<Placeholder name='Student Profile' />} />
      </Route>

      {/* Employer area: guard and layout come when we build EmployerLayout. */}
      <Route
        path='/employer'
        element={
          <ProtectedRoute allowedRoles={['employer']}>
            <Placeholder name='Employer Layout' />
          </ProtectedRoute>
        }
      >
        <Route path='dashboard' element={<Placeholder name='Employer Dashboard' />} />
        <Route path='post' element={<Placeholder name='Post Opening' />} />
        <Route path='applications' element={<Placeholder name='Employer Applications' />} />
      </Route>

      {/* Coordinator area: guard and layout come when we build CoordinatorLayout. */}
      <Route
        path='/coordinator'
        element={
          <ProtectedRoute allowedRoles={['coordinator']}>
            <Placeholder name='Coordinator Layout' />
          </ProtectedRoute>
        }
      >
        <Route path='overview' element={<Placeholder name='Coordinator Overview' />} />
        <Route path='placements' element={<Placeholder name='Placement Records' />} />
      </Route>

      {/* Anything else: not found. */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}
