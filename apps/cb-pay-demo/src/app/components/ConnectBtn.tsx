import { Button } from '@mui/material';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PhantomWalletName } from '@solana/wallet-adapter-phantom';

export const ConnectBtn = () => {
  const { connection } = useConnection();
  const { select, connect, disconnect, connecting, connected, disconnecting } =
    useWallet();

  const handleWalletConnect = () => {
    console.log('attempting connect', connection, connecting, connected);
    if (connecting || connected) return;
    select(PhantomWalletName);
    connect().catch((err) => {
      // Silently catch because any errors are caught by the context `onError` handler
      console.log('error connecting', err);
    });
  };

  const handleWalletDisconnect = () => {
    console.log('attempting disconnect');
    if (disconnecting) return;
    disconnect();
  };

  return connected ? (
    <Button
      variant="contained"
      onClick={handleWalletDisconnect}
      disabled={disconnecting}
    >
      Disconnect
    </Button>
  ) : (
    <Button
      variant="contained"
      onClick={handleWalletConnect}
      disabled={connecting || connected}
    >
      Connect
    </Button>
  );
};
