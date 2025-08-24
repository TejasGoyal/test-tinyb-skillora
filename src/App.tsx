import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BrandingProvider } from "@/contexts/BrandingContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import SchoolCodePage from "@/pages/SchoolCodePage";
import LoginPage from "@/pages/LoginPage";
import AdminDashboard from "@/pages/dashboards/AdminDashboard";
import TeacherDashboard from "@/pages/dashboards/TeacherDashboard";
import ParentDashboard from "@/pages/dashboards/ParentDashboard";
import NotFound from "@/pages/NotFound";
import ChatWithAI from "@/pages/ChatWithAI";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, profile, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-school-primary"></div>
      </div>
    );
  }
  
  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrandingProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<SchoolCodePage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected Dashboard Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>
              
              <Route path="/teacher" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<TeacherDashboard />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>
              
              <Route path="/parent" element={
                <ProtectedRoute allowedRoles={['parent']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<ParentDashboard />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>
              
              {/* Chat with AI route (all authenticated users) */}
              <Route path="/chat" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<ChatWithAI />} />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </BrandingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
