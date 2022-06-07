import { Typography } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';

export function WalletStatus() {
  const { connected, connecting, disconnecting } = useWallet();

  return (
    <div>
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

const snippet = `import { Typography } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';

export function WalletStatus() {
  const { connected, connecting, disconnecting } = useWallet();

  return (
    <div>
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
}`;

export default snippet;
