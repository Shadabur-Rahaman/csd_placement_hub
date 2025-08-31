import React, { Suspense, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Skeleton } from '../../components/ui/skeleton';

// Import components from the student visual tool
const Dashboard = React.lazy(() => import('../../pages/Dashboard'));
const StudentDetail = React.lazy(() => import('../../pages/StudentDetail'));
const Analytics = React.lazy(() => import('../../pages/Analytics'));
const Navigation = React.lazy(() => import('../../components/Navigation'));

const queryClient = new QueryClient();

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="container mx-auto p-8">
    <div className="space-y-4">
      <Skeleton className="h-12 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="grid grid-cols-4 gap-4 mt-8">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      <Skeleton className="h-64 w-full mt-8" />
    </div>
  </div>
);

// Wrapper component to handle the student visual tool routes
const StudentVisualToolWrapper = () => {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route 
            path="/" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Dashboard />
              </Suspense>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Analytics />
              </Suspense>
            } 
          />
          <Route 
            path="/student/:id" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <StudentDetail />
              </Suspense>
            } 
          />
          <Route path="*" element={<Navigate to="/student-visual-tool" replace />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
};

// Main component that wraps with QueryClientProvider
const StudentVisualTool = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StudentVisualToolWrapper />
    </QueryClientProvider>
  );
};

export default StudentVisualTool;
