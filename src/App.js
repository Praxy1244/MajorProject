import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';

// Layout Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Layout/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/Dashboard';
import DonationForm from './pages/donor/DonationForm';
import MyDonations from './pages/donor/MyDonations';
import DonorInsights from './pages/donor/DonorInsights';
import DonorImpact from './pages/donor/DonorImpact';
import BrowseNeeds from "./pages/donor/BrowseNeeds";
import DonorProfile from "./pages/donor/DonorProfile";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                {/* Donor Routes */}
                <Route path="/donate" element={
                  <ProtectedRoute allowedRoles={['donor']}>
                    <DonationForm />
                  </ProtectedRoute>
                } />
                
                <Route path="/my-donations" element={
                  <ProtectedRoute allowedRoles={['donor']}>
                    <MyDonations />
                  </ProtectedRoute>
                } />

                <Route path="/donor/insights" element={
                  <ProtectedRoute allowedRoles={['donor']}>
                    <DonorInsights />
                  </ProtectedRoute>
                } />

                <Route path="/donor/impact" element={
                  <ProtectedRoute allowedRoles={['donor']}>
                    <DonorImpact />
                  </ProtectedRoute>
                } />

                
                {/* Recipient Routes */}
                <Route path="/browse" element={
                  <ProtectedRoute allowedRoles={['donor', 'recipient']}>
                   <BrowseNeeds />
                  </ProtectedRoute>
                } />

                <Route path="/profile" element={
                  <ProtectedRoute allowedRoles={['donor']}>
                    <DonorProfile />
                  </ProtectedRoute>
                } />


                <Route path="/my-requests" element={
                  <ProtectedRoute allowedRoles={['recipient']}>
                    <div className="p-8 text-center">
                      <h2 className="text-2xl font-bold mb-4">My Requests</h2>
                      <p className="text-gray-600">Request tracking coming soon...</p>
                    </div>
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin/*" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <div className="p-8 text-center">
                      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
                      <p className="text-gray-600">Admin features coming soon...</p>
                    </div>
                  </ProtectedRoute>
                } />

                {/* Catch all */}
                <Route path="*" element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
                      <p className="text-gray-600">The page you're looking for doesn't exist.</p>
                    </div>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
