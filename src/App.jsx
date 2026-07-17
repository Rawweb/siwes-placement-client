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
import Profile from './pages/student/Profile.jsx';

import EmployerLayout from './components/EmployerLayout.jsx';
import Dashboard from './pages/employer/Dashboard.jsx';
import PostOpening from './pages/employer/PostOpening.jsx';
import Applications from './pages/employer/Applications.jsx';

import CoordinatorLayout from './components/CoordinatorLayout.jsx';
import Overview from './pages/coordinator/Overview.jsx';
import PlacementRecords from './pages/coordinator/PlacementRecords.jsx';

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
        <Route path='profile' element={<Profile />} />
      </Route>

      {/* Employer area: guard and layout come when we build EmployerLayout. */}
      <Route
        path='/employer'
        element={
          <ProtectedRoute allowedRoles={['employer']}>
            <EmployerLayout />
          </ProtectedRoute>
        }
      >
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='post' element={<PostOpening />} />
        <Route path='applications' element={<Applications />} />
      </Route>

      {/* Coordinator area: guard and layout come when we build CoordinatorLayout. */}
      <Route
        path='/coordinator'
        element={
          <ProtectedRoute allowedRoles={['coordinator']}>
            <CoordinatorLayout />
          </ProtectedRoute>
        }
      >
        <Route path='overview' element={<Overview />} />
        <Route path='placements' element={<PlacementRecords />} />
      </Route>

      {/* Anything else: not found. */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}
