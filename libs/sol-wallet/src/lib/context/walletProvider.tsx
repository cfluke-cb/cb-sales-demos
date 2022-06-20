import { useCallback, useMemo, useContext } from 'react';
import { WalletError, Adapter } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { clusterApiUrl } from '@solana/web3.js';
import { NetworkContext } from './networkProvider';

export interface Constructable<T> {
  new (): T;
}

export const Context = ({
  children,
  walletList,
}: {
  children: JSX.Element | JSX.Element[];
  walletList: Constructable<Adapter>[];
}) => {
  const { network } = useContext(NetworkContext);
  console.log('setting connector network', network);
  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = [] as Adapter[];
  if (walletList && walletList.length > 0) {
    walletList.forEach((wal) => {
      wallets.push(new wal() as Adapter);
    });
  } else {
    wallets.push(new PhantomWalletAdapter() as Adapter);
  }

  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError}>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};
