import { useEffect, useState } from 'react';
import { formatEther } from '@ethersproject/units';
import { useWeb3React } from '@web3-react/core';

export const useGetAccountInfo = () => {
  const { provider, account, ENSNames } = useWeb3React();
  const [fmtAccount, setAccount] = useState<any>({});

  useEffect(() => {
    const fetchInitial = async () => {
      if (!provider || !account) return;
      console.log('fetching account info with', account);
      const balance = await provider.getBalance(account);
      const newAccount = {
        account: account, //await provider.getParsedAccountInfo(publicKey),
        balance,
        //version: await provider.getVersion(),
        ENSNames,
        fmtBalance: '',
      };
      newAccount.fmtBalance = formatEther(newAccount.balance);
      console.log('new account', newAccount);

      setAccount(newAccount);
    };

    fetchInitial();
  }, [provider, account]);

  return { account: fmtAccount, walletAddress: account };
};
