import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { clusterApiUrl } from '@solana/web3.js';

const network = 'mainnet-beta';
// You can also provide a custom RPC endpoint.
const endpoint = clusterApiUrl(network);
//Can provide a list of Wallets
const wallets = [new PhantomWalletAdapter()];

export const Context = ({ children }) => (
  <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={wallets}>{children}</WalletProvider>
  </ConnectionProvider>
);

const snippet = `import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { clusterApiUrl } from '@solana/web3.js';

const network = 'mainnet-beta';
// You can also provide a custom RPC endpoint.
const endpoint = clusterApiUrl(network);
//Can provide a list of Wallets
const wallets = [new PhantomWalletAdapter()];

export const Context = ({ children }) => (
  <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={wallets}>{children}</WalletProvider>
  </ConnectionProvider>
);
`;

export default snippet;
