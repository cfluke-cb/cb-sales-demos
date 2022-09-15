import { createTheme, ThemeProvider } from '@mui/material';
import { WalletProvider } from '@cb-sales-demos/wallet-sol';
import { Router } from './routes';
import { ChatContextProvider } from './context/ChatContext';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { CoinbaseWalletAdapter } from '@solana/wallet-adapter-wallets';

const walletList = [PhantomWalletAdapter, CoinbaseWalletAdapter];

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
      <WalletProvider walletList={walletList}>
        <ChatContextProvider>
          <Router />
        </ChatContextProvider>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;
