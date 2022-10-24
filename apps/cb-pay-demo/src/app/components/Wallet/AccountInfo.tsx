import { Typography } from '@mui/material';
import { useGetAccountInfo } from '@cb-sales-demos/wallet-sol';

export const AccountInfo = ({ onClick }: { onClick: (i: number) => void }) => {
  const { account, walletAddress } = useGetAccountInfo();

  if (!account) return null;
  return (
    <div onClick={() => onClick(4)}>
      <Typography variant="inherit" fontWeight={600}>
        Address:
        <Typography
          variant="inherit"
          component={'span'}
          textOverflow={'ellipsis'}
          fontWeight={400}
          paddingLeft={2}
          overflow="hidden"
        >
          {walletAddress}
        </Typography>
      </Typography>
      <Typography variant="inherit" fontWeight={600}>
        Balance:
        <Typography
          variant="inherit"
          component={'span'}
          textOverflow={'ellipsis'}
          fontWeight={400}
          paddingLeft={2}
          overflow="hidden"
        >
          {account?.fmtBalance || 0}
        </Typography>
      </Typography>
    </div>
  );
};
