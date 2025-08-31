import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import HomePage from './pages/home/HomePage';
import AdminDashboard from './components/admin/AdminDashboard';
import Login from './pages/Login';
import AdminSignup from './pages/AdminSignup';
import { auth } from './firebase/client';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/client';

// Lazy loaded components
const AdminHome = React.lazy(() => import('./pages/admin/AdminHome'));
const AdminNotifications = React.lazy(() => import('./pages/admin/AdminNotifications'));
const AdminCertifications = React.lazy(() => import('./pages/admin/AdminCertifications'));
const AdminAchievements = React.lazy(() => import('./pages/admin/AdminAchievements'));
const AdminResearch = React.lazy(() => import('./pages/admin/AdminResearch'));
const AdminPlacements = React.lazy(() => import('./pages/admin/AdminPlacements'));
const AdminEvents = React.lazy(() => import('./pages/admin/AdminEvents'));
const AdminStudents = React.lazy(() => import('./pages/admin/AdminStudents'));
const AdminFaculty = React.lazy(() => import('./pages/admin/AdminFaculty'));
const Certifications = React.lazy(() => import('./pages/academics/Certifications'));
const Achievements = React.lazy(() => import('./pages/academics/Achievements'));
const Research = React.lazy(() => import('./pages/academics/Research'));
const Placements = React.lazy(() => import('./pages/academics/Placements'));
const Events = React.lazy(() => import('./pages/events/Events'));
const Students = React.lazy(() => import('./pages/students/Students'));
const StudentDetail = React.lazy(() => import('./pages/students/StudentDetail'));
const Faculty = React.lazy(() => import('./pages/faculty/Faculty'));
const FacultyDetail = React.lazy(() => import('./pages/faculty/FacultyDetail'));
const AboutPage = React.lazy(() => import('./pages/about/AboutPage'));
const TestFirebase = React.lazy(() => import('./components/TestFirebase'));

// Admin protected route component
const AdminProtectedRoute = ({ children }) => {
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [checkingRole, setCheckingRole] = React.useState(true);
  
  React.useEffect(() => {
    const checkAdminRole = async () => {
      // Check for test admin in localStorage or sessionStorage
      const isTestAdmin = localStorage.getItem('isTestAdmin') === 'true' || 
                         sessionStorage.getItem('testAdmin') === 'true';
      
      if (isTestAdmin) {
        console.log('Test admin access detected');
        setIsAdmin(true);
        setCheckingRole(false);
        return;
      }
      
      // For authenticated users, check Firestore
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            console.log('Authenticated admin access granted');
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error checking admin role:', error);
        }
      }
      
      setCheckingRole(false);
    };
    
    checkAdminRole();
  }, [user]);
  
  // Check access conditions
  const isTestAdmin = localStorage.getItem('isTestAdmin') === 'true' || 
                     sessionStorage.getItem('testAdmin') === 'true';
  const hasAccess = isTestAdmin || (user && isAdmin);
  
  console.log('Access check:', { 
    isTestAdmin, 
    user: user ? { uid: user.uid, email: user.email } : null, 
    isAdmin, 
    hasAccess 
  });
  
  // If we're still checking, show loading
  if (checkingRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // If no access, redirect to login
  if (!hasAccess) {
    console.log('Redirecting to login - access denied');
    return <Navigate to="/admin/login" state={{ from: window.location.pathname }} replace />;
  }
  
  // If we get here, access is granted
  console.log('Access granted to admin area');
  
  // For test admin, ensure we have a user object
  if (isTestAdmin && !user) {
    // Force a page reload to properly initialize auth state
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
    return null;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <Layout>
            <HomePage />
          </Layout>
        } />
        
        {/* About page route */}
        <Route path="/about" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <AboutPage />
            </React.Suspense>
          </Layout>
        } />
        
        {/* Academic routes */}
        <Route path="/academics/certifications" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Certifications />
            </React.Suspense>
          </Layout>
        } />
        <Route path="/academics/certifications/:type" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Certifications />
            </React.Suspense>
          </Layout>
        } />
        <Route path="/academics/achievements" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Achievements />
            </React.Suspense>
          </Layout>
        } />
        <Route path="/academics/achievements/:type" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Achievements />
            </React.Suspense>
          </Layout>
        } />
        <Route path="/academics/research" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Research />
            </React.Suspense>
          </Layout>
        } />
        <Route path="/academics/research/:type" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Research />
            </React.Suspense>
          </Layout>
        } />
        <Route path="/academics/placements" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Placements />
            </React.Suspense>
          </Layout>
        } />
        
        {/* Events routes */}
        <Route path="/events" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Events />
            </React.Suspense>
          </Layout>
        } />
        <Route path="/events/:type" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Events />
            </React.Suspense>
          </Layout>
        } />
        
        {/* Students routes */}
        <Route path="/students" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Students />
            </React.Suspense>
          </Layout>
        } />
        <Route path="/students/:id" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <StudentDetail />
            </React.Suspense>
          </Layout>
        } />
        
        {/* Faculty routes */}
        <Route path="/faculty" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Faculty />
            </React.Suspense>
          </Layout>
        } />
        <Route path="/faculty/:id" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <FacultyDetail />
            </React.Suspense>
          </Layout>
        } />
        <Route path="/test-firebase" element={<TestFirebase />} />
        
        {/* Auth routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        
        {/* Admin routes - protected */}
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminDashboard>
              <React.Suspense fallback={<div>Loading...</div>}>
                <AdminHome />
              </React.Suspense>
            </AdminDashboard>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/notifications" element={
          <AdminProtectedRoute>
            <AdminDashboard>
              <React.Suspense fallback={<div>Loading...</div>}>
                <AdminNotifications />
              </React.Suspense>
            </AdminDashboard>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/certifications" element={
          <AdminProtectedRoute>
            <AdminDashboard>
              <React.Suspense fallback={<div>Loading...</div>}>
                <AdminCertifications />
              </React.Suspense>
            </AdminDashboard>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/achievements" element={
          <AdminProtectedRoute>
            <AdminDashboard>
              <React.Suspense fallback={<div>Loading...</div>}>
                <AdminAchievements />
              </React.Suspense>
            </AdminDashboard>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/research" element={
          <AdminProtectedRoute>
            <AdminDashboard>
              <React.Suspense fallback={<div>Loading...</div>}>
                <AdminResearch />
              </React.Suspense>
            </AdminDashboard>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/placements" element={
          <AdminProtectedRoute>
            <AdminDashboard>
              <React.Suspense fallback={<div>Loading...</div>}>
                <AdminPlacements />
              </React.Suspense>
            </AdminDashboard>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/events" element={
          <AdminProtectedRoute>
            <AdminDashboard>
              <React.Suspense fallback={<div>Loading...</div>}>
                <AdminEvents />
              </React.Suspense>
            </AdminDashboard>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/students" element={
          <AdminProtectedRoute>
            <AdminDashboard>
              <React.Suspense fallback={<div>Loading...</div>}>
                <AdminStudents />
              </React.Suspense>
            </AdminDashboard>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/faculty" element={
          <AdminProtectedRoute>
            <AdminDashboard>
              <React.Suspense fallback={<div>Loading...</div>}>
                <AdminFaculty />
              </React.Suspense>
            </AdminDashboard>
          </AdminProtectedRoute>
        } />
        
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;