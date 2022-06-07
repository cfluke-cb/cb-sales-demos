import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export const AccountInfo = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const updateAccount = async () => {
      if (!publicKey) return;

      const newAccount = {
        account: await connection.getParsedAccountInfo(publicKey),
        balance: await connection.getBalanceAndContext(publicKey),
        version: await connection.getVersion(),
        fmtBalance: 0,
      };
      newAccount.fmtBalance = newAccount.balance.value / LAMPORTS_PER_SOL;

      setAccount(newAccount);
    };

    updateAccount();
  }, [connection, publicKey]);

  const walletAddr = publicKey?.toBase58();

  if (!walletAddr) return null;
  return (
    <>
      <Typography variant="inherit" fontWeight={600}>
        Address:
        <Typography variant="inherit">{walletAddr}</Typography>
      </Typography>
      <Typography variant="inherit" fontWeight={600}>
        Balance:
        <Typography variant="inherit">{account?.fmtBalance}</Typography>
      </Typography>
    </>
  );
};

const snippet = `import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export const AccountInfo = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const updateAccount = async () => {
      if (!publicKey) return;

      const newAccount = {
        account: await connection.getParsedAccountInfo(publicKey),
        balance: await connection.getBalanceAndContext(publicKey),
        version: await connection.getVersion(),
        fmtBalance: 0,
      };
      newAccount.fmtBalance = newAccount.balance.value / LAMPORTS_PER_SOL;

      setAccount(newAccount);
    };

    updateAccount();
  }, [connection, publicKey]);

  const walletAddr = publicKey?.toBase58();

  if (!walletAddr) return null;
  return (
    <>
      <Typography variant="inherit" fontWeight={600}>
        Address:
        <Typography variant="inherit">{walletAddr}</Typography>
      </Typography>
      <Typography variant="inherit" fontWeight={600}>
        Balance:
        <Typography variant="inherit">{account?.fmtBalance}</Typography>
      </Typography>
    </>
  );
};`;

export default snippet;
