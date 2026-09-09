import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar, { DRAWER_WIDTH } from './components/Sidebar';
import Navbar from './components/Navbar';
import Overview from './pages/Overview';
import Nodes from './pages/Nodes';
import Pods from './pages/Pods';
import Deployments from './pages/Deployments';
import Services from './pages/Services';
import Namespaces from './pages/Namespaces';
import Metrics from './pages/Metrics';
import Alerts from './pages/Alerts';
import Logs from './pages/Logs';
import Events from './pages/Events';
import YamlEditor from './pages/YamlEditor';
import RBAC from './pages/RBAC';
import Settings from './pages/Settings';
import Login from './pages/Login';

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
          <Route path="/pods" element={<ProtectedRoute><DashboardLayout><Pods /></DashboardLayout></ProtectedRoute>} />
          <Route path="/deployments" element={<ProtectedRoute><DashboardLayout><Deployments /></DashboardLayout></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><DashboardLayout><Services /></DashboardLayout></ProtectedRoute>} />
          <Route path="/namespaces" element={<ProtectedRoute><DashboardLayout><Namespaces /></DashboardLayout></ProtectedRoute>} />
          <Route path="/metrics" element={<ProtectedRoute><DashboardLayout><Metrics /></DashboardLayout></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><DashboardLayout><Alerts /></DashboardLayout></ProtectedRoute>} />
          <Route path="/logs" element={<ProtectedRoute><DashboardLayout><Logs /></DashboardLayout></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><DashboardLayout><Events /></DashboardLayout></ProtectedRoute>} />
          <Route path="/yaml" element={<ProtectedRoute><DashboardLayout><YamlEditor /></DashboardLayout></ProtectedRoute>} />
          <Route path="/rbac" element={<ProtectedRoute><DashboardLayout><RBAC /></DashboardLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><DashboardLayout><Settings /></DashboardLayout></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
