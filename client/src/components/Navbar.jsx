import React, { useState } from 'react';
import {
  Box,
  InputBase,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Chip,
  Divider,
  ListItemIcon,
  Tooltip,
  alpha,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <Box
      component="header"
      sx={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        gap: 2,
      }}
    >
      {/* Left: Search Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          px: 1.5,
          py: 0.75,
          width: { xs: 200, sm: 320, md: 380 },
          transition: 'border-color 0.2s',
          '&:focus-within': {
            borderColor: 'primary.main',
          },
        }}
      >
        <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
        <InputBase
          placeholder="Search resources... (Ctrl+K)"
          sx={{
            flex: 1,
            fontSize: '0.875rem',
            color: 'text.primary',
          }}
        />
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            bgcolor: (theme) => alpha(theme.palette.common.white, 0.06),
            px: 0.75,
            py: 0.25,
            borderRadius: 1,
            ml: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', fontWeight: 600 }}>
            Ctrl+K
          </Typography>
        </Box>
      </Box>

      {/* Right: Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
        {/* Cluster Indicator */}
        <Chip
          icon={<CloudDoneIcon sx={{ fontSize: '16px !important' }} />}
          label="Default Cluster"
          size="small"
          sx={{
            display: { xs: 'none', sm: 'flex' },
            bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
            color: 'success.main',
            border: '1px solid',
            borderColor: (theme) => alpha(theme.palette.success.main, 0.25),
            fontWeight: 500,
            fontSize: '0.75rem',
            '& .MuiChip-icon': { color: 'success.main' },
          }}
        />

        {/* Notification Bell */}
        <Tooltip title="Notifications">
          <IconButton
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' },
            }}
          >
            <Badge
              badgeContent={3}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.6rem',
                  height: 16,
                  minWidth: 16,
                },
              }}
            >
              <NotificationsNoneIcon sx={{ fontSize: 22 }} />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Vertical Divider */}
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, display: { xs: 'none', sm: 'block' } }} />

        {/* User Avatar & Menu */}
        <Box
          onClick={handleMenuOpen}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            px: 1,
            py: 0.5,
            borderRadius: 2,
            transition: 'background 0.2s',
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.common.white, 0.05),
            },
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: 'primary.main',
              fontSize: '0.875rem',
              fontWeight: 700,
            }}
          >
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2, color: 'text.primary' }}>
              {user?.username || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1, fontSize: '0.65rem' }}>
              {user?.role || 'user'}
            </Typography>
          </Box>
          <KeyboardArrowDownIcon sx={{ color: 'text.secondary', fontSize: 18, display: { xs: 'none', sm: 'block' } }} />
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                minWidth: 180,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              },
            },
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <Typography color="error.main">Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Navbar;
