import { Button } from '@mui/material';
import { useWallet } from '@cb-sales-demos/sol-wallet';
import { PhantomWalletName } from '@solana/wallet-adapter-phantom';

export const ConnectBtn = () => {
  const {
    connectWallet,
    disconnectWallet,
    connecting,
    connected,
    disconnecting,
  } = useWallet();

  const handleConnectWallet = () => {
    connectWallet(PhantomWalletName);
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
