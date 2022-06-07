import { Button } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';

export const ConnectBtn = () => {
  const { connect, connecting, connected } = useWallet();

  const handleWalletConnect = () => {
    if (connecting || connected) return;

    connect().catch((err) => {
      // Silently catch because any errors are caught by the context `onError` handler
      console.log('error connecting', err);
    });
  };

  return (
    <Button
      variant="contained"
      onClick={handleWalletConnect}
      disabled={connecting || connected}
    >
      Connect
    </Button>
  );
};

const snippet = `import { Button } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';

export const ConnectBtn = () => {
  const { connect, connecting, connected } = useWallet();

  const handleWalletConnect = () => {
    if (connecting || connected) return;

    connect().catch((err) => {
      // Silently catch because any errors are caught by the context onError handler
      console.log('error connecting', err);
    });
  };

  return (
    <Button
      variant="contained"
      onClick={handleWalletConnect}
      disabled={connecting || connected}
    >
      Connect
    </Button>
  );
};`;
export default snippet;
