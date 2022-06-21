import { WalletName } from '@solana/wallet-adapter-base';
import { useWeb3React } from '@web3-react/core';
import { useState } from 'react';
import { utils } from 'ethers';

export const useWallet = () => {
  const {
    isActivating: connecting,
    isActive: connected,
    connector,
    provider,
    account,
  } = useWeb3React();
  const [disconnecting, setDisconnecting] = useState(false);

  const connectWallet = (name: WalletName) => {
    if (connecting) return;

    //how to manage switching active connector, may need to add my select call
    connector?.activate()?.catch((err) => {
      // Silently catch because any errors are caught by the context `onError` handler
      console.log('error connecting', err);
    });
  };

  const disconnectWallet = () => {
    setDisconnecting(true);
    console.log('attempting disconnect');
    if (disconnecting) return;
    connector?.deactivate?.();
    setDisconnecting(false);
  };

  const signMessage = async (message: string) => {
    if (!message || !provider) return null;
    const signer = provider.getSigner(account);
    const hexMessage = utils.hexlify(utils.toUtf8Bytes(message));
    return await signer.signMessage(hexMessage);
  };

  return {
    publicKey: account,
    connected,
    connecting,
    disconnecting,
    connectWallet,
    disconnectWallet,
    signMessage,
  };
};
