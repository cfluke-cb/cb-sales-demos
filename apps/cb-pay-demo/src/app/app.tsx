import { createTheme, ThemeProvider } from '@mui/material';
import { Router } from './routes';
import { Context as WalletProvider } from './context/walletProvider';
import { NetworkContextProvider } from './context/networkProvider';

const mdTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3C2AC3',
    },
    text: {
      primary: '#fff',
      secondary: '#9e9fa0',
    },
    background: {
      default: '#212224',
      paper: '#28292c',
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: 'darkgray',
        },
      },
    },
  },
});

export function App() {
  return (
    <ThemeProvider theme={mdTheme}>
      <NetworkContextProvider>
        <WalletProvider>
          <Router />
        </WalletProvider>
      </NetworkContextProvider>
    </ThemeProvider>
  );
}

export default App;
