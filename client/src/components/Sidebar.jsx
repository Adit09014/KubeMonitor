import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  alpha,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DnsIcon from '@mui/icons-material/Dns';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LanguageIcon from '@mui/icons-material/Language';
import FolderIcon from '@mui/icons-material/Folder';
import TimelineIcon from '@mui/icons-material/Timeline';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ArticleIcon from '@mui/icons-material/Article';
import BuildIcon from '@mui/icons-material/Build';
import CodeIcon from '@mui/icons-material/Code';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SettingsIcon from '@mui/icons-material/Settings';

const DRAWER_WIDTH = 260;

const navSections = [
  {
    title: 'DASHBOARD',
    items: [
      { icon: <DashboardIcon />, label: 'Overview', path: '/' },
    ],
  },
  {
    title: 'CLUSTER',
    items: [
      { icon: <DnsIcon />, label: 'Nodes', path: '/nodes' },
      { icon: <ViewInArIcon />, label: 'Pods', path: '/pods' },
      { icon: <RocketLaunchIcon />, label: 'Deployments', path: '/deployments' },
      { icon: <LanguageIcon />, label: 'Services', path: '/services' },
      { icon: <FolderIcon />, label: 'Namespaces', path: '/namespaces' },
    ],
  },
  {
    title: 'MONITORING',
    items: [
      { icon: <TimelineIcon />, label: 'Metrics', path: '/metrics' },
      { icon: <NotificationsActiveIcon />, label: 'Alerts', path: '/alerts' },
    ],
  },
  {
    title: 'TROUBLESHOOT',
    items: [
      { icon: <ArticleIcon />, label: 'Logs', path: '/logs' },
      { icon: <BuildIcon />, label: 'Events', path: '/events' },
      { icon: <CodeIcon />, label: 'YAML Editor', path: '/yaml' },
    ],
  },
  {
    title: 'MANAGEMENT',
    items: [
      { icon: <AdminPanelSettingsIcon />, label: 'RBAC', path: '/rbac' },
      { icon: <SettingsIcon />, label: 'Settings', path: '/settings' },
    ],
  },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          px: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: 'primary.main',
            fontWeight: 800,
            letterSpacing: '0.05em',
            fontSize: '1.25rem',
          }}
        >
          ☸ KubePulse
        </Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        {navSections.map((section, sectionIdx) => (
          <Box key={section.title}>
            {sectionIdx > 0 && <Divider sx={{ my: 1, mx: 2 }} />}
            <Typography
              variant="overline"
              sx={{
                px: 3,
                py: 1,
                display: 'block',
                color: 'text.secondary',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
              }}
            >
              {section.title}
            </Typography>
            <List sx={{ px: 1.5, py: 0 }} disablePadding>
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItemButton
                    key={item.path}
                    component={NavLink}
                    to={item.path}
                    selected={isActive}
                    sx={{
                      py: 1,
                      px: 1.5,
                      mb: 0.5,
                      borderRadius: 2,
                      '& .MuiListItemIcon-root': {
                        color: isActive ? 'primary.main' : 'text.secondary',
                        minWidth: 36,
                      },
                      '&.Mui-selected': {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                        '&:hover': {
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15),
                        },
                      },
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.common.white, 0.04),
                      },
                    }}
                  >
                    <ListItemIcon sx={{ fontSize: 20 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          KubePulse Dashboard v1.0.0
        </Typography>
      </Box>
    </Drawer>
  );
};

export { DRAWER_WIDTH };
export default Sidebar;
