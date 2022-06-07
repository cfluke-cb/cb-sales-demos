import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export const AccountInfo = ({ onClick }: { onClick: (i: number) => void }) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [account, setAccount] = useState<any | null>(null);

  useEffect(() => {
    const fetchInitial = async () => {
      if (!publicKey) return;
      console.log('fetching account info with', publicKey);
      const newAccount = {
        account: await connection.getParsedAccountInfo(publicKey),
        balance: await connection.getBalanceAndContext(publicKey),
        version: await connection.getVersion(),
        fmtBalance: 0,
      };
      newAccount.fmtBalance = newAccount.balance.value / LAMPORTS_PER_SOL;
      console.log('new account', newAccount);

      setAccount(newAccount);
    };

    fetchInitial();
  }, [connection, publicKey]);

  const walletAddr = publicKey?.toBase58();

  if (!walletAddr) return null;
  return (
    <div onClick={() => onClick(4)}>
      <Typography variant="inherit" fontWeight={600}>
        Address:
        <Typography
          variant="inherit"
          textOverflow={'ellipsis'}
          fontWeight={400}
          paddingLeft={2}
          overflow="hidden"
        >
          {walletAddr}
        </Typography>
      </Typography>
      <Typography variant="inherit" fontWeight={600}>
        Balance:
        <Typography
          variant="inherit"
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
