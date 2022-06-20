import { Adapter } from '@solana/wallet-adapter-base';
import {
  Context as WalProvider,
  Constructable,
} from './context/walletProvider';
import { NetworkContextProvider } from './context/networkProvider';

export function WalletProvider({
  children,
  walletList = [],
}: {
  children: JSX.Element | JSX.Element[];
  walletList?: Constructable<Adapter>[];
}) {
  return (
    <NetworkContextProvider>
      <WalProvider walletList={walletList}>{children}</WalProvider>
    </NetworkContextProvider>
  );
}

export default WalletProvider;
