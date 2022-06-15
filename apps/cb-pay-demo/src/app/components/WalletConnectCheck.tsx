import { useWallet } from '@solana/wallet-adapter-react';
import { PhantomWalletName } from '@solana/wallet-adapter-phantom';
import { Typography, Link } from '@mui/material';

export const WalletConnectCheck = () => {
  const { connected, connecting, select, connect } = useWallet();

  const connectWallet = () => {
    if (connecting) return;
    select(PhantomWalletName);
    connect().catch((err) => {
      // Silently catch because any errors are caught by the context `onError` handler
      console.log('error connecting', err);
    });
  };

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
