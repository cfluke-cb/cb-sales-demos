import { Button } from '@mui/material';
import { useWallet } from '@cb-sales-demos/sol-wallet';

export const ConnectBtn = () => {
  const {
    connectWallet,
    disconnectWallet,
    connecting,
    connected,
    disconnecting,
  } = useWallet();

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
      onClick={connectWallet}
      disabled={connecting || connected}
    >
      Connect
    </Button>
  );
};
