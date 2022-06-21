import { Typography, Link } from '@mui/material';
import { useWallet } from '@cb-sales-demos/sol-wallet';
import { PhantomWalletName } from '@solana/wallet-adapter-phantom';

export const WalletConnectCheck = () => {
  const { connected, connecting, connectWallet } = useWallet();

  const handleConnectWallet = () => {
    connectWallet(PhantomWalletName);
  };

  if (connected || connecting) return null;
  return (
    <Typography variant="inherit">
      Please{' '}
      <Link
        component="button"
        variant="body2"
        color="secondary"
        onClick={handleConnectWallet}
      >
        connect
      </Link>{' '}
      your wallet
    </Typography>
  );
};
