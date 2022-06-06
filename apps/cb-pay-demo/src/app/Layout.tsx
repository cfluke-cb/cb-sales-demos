import { FC, useState, useEffect } from 'react';
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  Box,
  Toolbar,
  AppBar,
  IconButton,
  CssBaseline,
  Typography,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentsIcon from '@mui/icons-material/Payments';
import ChatIcon from '@mui/icons-material/Chat';

import { LogoDark } from './logos/logoDark';
import { LogoWordmark } from './logos/logoWordmark';

type LayoutType = {
  isMobile: boolean;
  maxMobileWidth: number;
};

const mobileWidth = 767;
const navItems = [
  {
    title: 'Home',
    Icon: HomeIcon,
  },
  {
    title: 'Wallet',
    Icon: AccountBalanceWalletIcon,
  },
  {
    title: 'Pay',
    Icon: PaymentsIcon,
  },
  {
    title: 'Chat',
    Icon: ChatIcon,
  },
];

export const Layout: FC = () => {
  const navigate = useNavigate();
  const { connected, publicKey } = useWallet();
  const [isMobile, setIsMobile] = useState(window.innerWidth < mobileWidth);
  const [maxMobileWidth, setMobileWidth] = useState(window.innerWidth - 40);
  const [drawerWidth, setDrawerWidth] = useState(isMobile ? 240 : 80);
  const [desktopMinimized, setDesktopMinimized] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < mobileWidth;
      setIsMobile(mobile);
      if (mobile && !isMobile && desktopMinimized) setDesktopMinimized(false);
      if (mobile && !isMobile) setDrawerWidth(240);
      setMobileWidth(window.innerWidth - 130);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile, desktopMinimized]);

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogoClick = () => {
    if (isMobile) return;
    setDesktopMinimized(!desktopMinimized);
    if (desktopMinimized) {
      setDrawerWidth(240);
    } else {
      setDrawerWidth(80);
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path?.toLowerCase());
    if (isMobile) setMobileOpen(false);
  };

  const drawer = (
    <div>
      <Toolbar>
        {desktopMinimized ? (
          <Box onClick={handleLogoClick}>
            <LogoDark />
          </Box>
        ) : (
          <Box onClick={handleLogoClick}>
            <LogoWordmark />
          </Box>
        )}
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={`nav-item-${item.title}`} disablePadding>
            <ListItemButton
              sx={{ justifyContent: 'space-around' }}
              onClick={() => handleNavigate(item.title)}
            >
              <ListItemIcon sx={{ justifyContent: 'space-around' }}>
                <item.Icon />
              </ListItemIcon>
              {!desktopMinimized && <ListItemText primary={item.title} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;

  let walletAddr = '';
  if (publicKey) {
    const b = publicKey?.toBase58();
    walletAddr = b.slice(0, 4) + '...' + b.slice(-4);
  }

  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            A Friend of Ours
          </Typography>
          {connected && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <AccountBalanceWalletIcon
                fontSize="large"
                sx={{ color: '#3C2AC3' }}
              />
              <Box sx={{ p: 1 }}>{walletAddr}</Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet context={{ isMobile, maxMobileWidth }} />
      </Box>
    </Box>
  );
};

export function useLayoutContext() {
  return useOutletContext<LayoutType>();
}
