import { Adapter } from '@solana/wallet-adapter-base';
import { Context as WalProvider } from './context/walletProvider';
import { NetworkContextProvider } from './context/networkProvider';

export function WalletProvider({
  children,
  overrideWallet = false,
  walletList = [],
}: {
  children: JSX.Element | JSX.Element[];
  overrideWallet?: boolean;
  walletList?: Adapter[];
}) {
  return (
    <NetworkContextProvider>
      <WalProvider overrideWallet={overrideWallet} walletList={walletList}>
        {children}
      </WalProvider>
    </NetworkContextProvider>
  );
}

export default WalletProvider;
