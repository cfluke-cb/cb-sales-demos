import { useWallet as useSolWallet } from '@solana/wallet-adapter-react';
import { PhantomWalletName } from '@solana/wallet-adapter-phantom';

export const useWallet = () => {
  const { publicKey, connected, connecting, disconnecting, select, connect, disconnect, signMessage } = useSolWallet();

  const connectWallet = () => {
    if (connecting) return;
    select(PhantomWalletName);
    connect().catch((err) => {
      // Silently catch because any errors are caught by the context `onError` handler
      console.log('error connecting', err);
    });
  };

  const disconnectWallet = () => {
    console.log('attempting disconnect');
    if (disconnecting) return;
    disconnect();
  };

  return { publicKey, connected, connecting, disconnecting, connectWallet, disconnectWallet, signMessage };
};
