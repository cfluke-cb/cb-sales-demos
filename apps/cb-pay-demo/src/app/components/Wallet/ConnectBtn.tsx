import { Button } from '@mui/material';
import { useWallet } from '@cb-sales-demos/wallet-sol';
import { PhantomWalletName } from '@solana/wallet-adapter-phantom';
import { CoinbaseWalletName } from '@solana/wallet-adapter-wallets';

export const ConnectBtn = ({ walletName }: { walletName: string }) => {
  const {
    connectWallet,
    disconnectWallet,
    connecting,
    connected,
    disconnecting,
  } = useWallet();

  const handleConnectWallet = () => {
    if (walletName === CoinbaseWalletName.toString()) {
      connectWallet(CoinbaseWalletName);
    } else if (walletName === PhantomWalletName.toString()) {
      connectWallet(PhantomWalletName);
    }
  };

  return connected ? (
    <Button
      variant="contained"
      onClick={disconnectWallet}
      disabled={disconnecting}
    >
      Disconnect
    </Button>
  ) : (
    <Button
      variant="contained"
      onClick={handleConnectWallet}
      disabled={connecting || connected}
    >
      Connect
    </Button>
  );
};
