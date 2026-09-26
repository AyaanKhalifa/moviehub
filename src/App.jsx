import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import PwaInstallPrompt from './components/PwaInstallPrompt';
import MaintenanceScreen from './components/MaintenanceScreen';
import Home from './pages/Home';
import Search from './pages/Search';
import MovieDetails from './pages/MovieDetails';
import Watchlist from './pages/Watchlist';
import Upcoming from './pages/Upcoming';
import Latest from './pages/Latest';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import { AuthProvider } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import './App.css';

function MainAppLayout() {
  const { isMaintenanceActive, isAdmin } = useAdmin();
  const location = useLocation();

  // Show Maintenance Poem Screen if maintenance is ON and viewer is not logged in as Admin
  // Still allow accessing /login and /admin to log in as admin
  const isBypassRoute = location.pathname === '/admin' || location.pathname === '/login';
  const shouldShowMaintenance = isMaintenanceActive && !isAdmin && !isBypassRoute;

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {shouldShowMaintenance ? (
          <MaintenanceScreen />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/latest" element={<Latest />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </main>
      <Footer />
      <MobileBottomNav />
      <PwaInstallPrompt />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <WatchlistProvider>
          <MainAppLayout />
        </WatchlistProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
