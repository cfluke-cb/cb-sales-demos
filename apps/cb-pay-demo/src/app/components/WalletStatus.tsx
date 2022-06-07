import { Typography } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';

export function WalletStatus({ onClick }: { onClick: (i: number) => void }) {
  const { connected, connecting, disconnecting } = useWallet();

  return (
    <div onClick={() => onClick(3)}>
      <Typography variant="inherit">
        {connecting ? (
          <>🟡 Connecting</>
        ) : connected ? (
          <>🟢 Connected</>
        ) : disconnecting ? (
          <>🟢 Disconnecting</>
        ) : (
          <>⚪️ Disconnected</>
        )}
      </Typography>
    </div>
  );
}
