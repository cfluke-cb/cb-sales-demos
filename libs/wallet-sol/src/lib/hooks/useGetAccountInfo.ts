import { useEffect, useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export const useGetAccountInfo = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [account, setAccount] = useState<any>({});
  const [walletAddr, setWalletAddr] = useState<string>('');

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

  useEffect(() => {
    setWalletAddr(publicKey?.toBase58() || '');
  }, [publicKey]);

  return { account, walletAddress: walletAddr };
};
