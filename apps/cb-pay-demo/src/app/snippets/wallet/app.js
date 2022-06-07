import { createTheme, ThemeProvider } from '@mui/material';
import { Router } from '../../routes';
import { Context as WalletProvider } from '../../context/walletProvider';

const mdTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3C2AC3',
    },
  },
});

export function App() {
  return (
    <ThemeProvider theme={mdTheme}>
      <WalletProvider>
        <Router />
      </WalletProvider>
    </ThemeProvider>
  );
}

const snippet = `import { createTheme, ThemeProvider } from '@mui/material';
import { Router } from '../routes';
import { Context as WalletProvider } from '../context/walletProvider';

const mdTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3C2AC3',
    },
  },
});

export function App() {
  return (
    <ThemeProvider theme={mdTheme}>
      <WalletProvider>
        <Router />
      </WalletProvider>
    </ThemeProvider>
  );
}
  `;

export default snippet;
