import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar, { DRAWER_WIDTH } from './components/Sidebar';
import Navbar from './components/Navbar';
import Overview from './pages/Overview';
import Nodes from './pages/Nodes';
import Login from './pages/Login';
import RBAC from './pages/RBAC';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress size={40} sx={{ color: 'primary.main', mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Authenticating session...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress size={40} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Placeholder page for sections not yet built
const ComingSoon = ({ title }) => (
  <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      This section is coming soon.
    </Typography>
  </Box>
);

const DashboardLayout = ({ children }) => (
  <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
    <Sidebar />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
      }}
    >
      <Navbar />
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </Box>
    </Box>
  </Box>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><DashboardLayout><Overview /></DashboardLayout></ProtectedRoute>} />
          <Route path="/nodes" element={<ProtectedRoute><DashboardLayout><Nodes /></DashboardLayout></ProtectedRoute>} />
          <Route path="/pods" element={<ProtectedRoute><DashboardLayout><ComingSoon title="Pods" /></DashboardLayout></ProtectedRoute>} />
          <Route path="/deployments" element={<ProtectedRoute><DashboardLayout><ComingSoon title="Deployments" /></DashboardLayout></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><DashboardLayout><ComingSoon title="Services" /></DashboardLayout></ProtectedRoute>} />
          <Route path="/namespaces" element={<ProtectedRoute><DashboardLayout><ComingSoon title="Namespaces" /></DashboardLayout></ProtectedRoute>} />
          <Route path="/metrics" element={<ProtectedRoute><DashboardLayout><ComingSoon title="Metrics" /></DashboardLayout></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><DashboardLayout><ComingSoon title="Alerts" /></DashboardLayout></ProtectedRoute>} />
          <Route path="/logs" element={<ProtectedRoute><DashboardLayout><ComingSoon title="Logs" /></DashboardLayout></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><DashboardLayout><ComingSoon title="Events" /></DashboardLayout></ProtectedRoute>} />
          <Route path="/yaml" element={<ProtectedRoute><DashboardLayout><ComingSoon title="YAML Editor" /></DashboardLayout></ProtectedRoute>} />
          <Route path="/rbac" element={<ProtectedRoute><DashboardLayout><RBAC /></DashboardLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><DashboardLayout><ComingSoon title="Settings" /></DashboardLayout></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
