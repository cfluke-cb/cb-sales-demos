import { Typography, Link } from '@mui/material';
import { useWallet } from '@cb-sales-demos/sol-wallet';

export const WalletConnectCheck = () => {
  const { connected, connecting, connectWallet } = useWallet();
  if (connected || connecting) return <></>;
  return (
    <Typography variant="inherit">
      Please{' '}
      <Link
        component="button"
        variant="body2"
        color="secondary"
        onClick={connectWallet}
      >
        connect
      </Link>{' '}
      your wallet
    </Typography>
  );
};
