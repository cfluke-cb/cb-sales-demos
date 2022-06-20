import { createTheme, ThemeProvider } from '@mui/material';
import { Router } from '../../routes';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
const mdTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3C2AC3',
    },
  },
});

export function App() {
  const wallets = [new PhantomWalletAdapter()];
  const endpoint = clusterApiUrl('mainnet-beta');
  return (
    <ThemeProvider theme={mdTheme}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
          <Router />
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
}

const snippet = `import { createTheme, ThemeProvider } from '@mui/material';
import { Router } from '../../routes';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
const mdTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3C2AC3',
    },
  },
});

export function App() {
  const wallets = [new PhantomWalletAdapter()];
  const endpoint = clusterApiUrl('mainnet-beta');
  return (
    <ThemeProvider theme={mdTheme}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
          <Router />
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
}`;

export default snippet;
