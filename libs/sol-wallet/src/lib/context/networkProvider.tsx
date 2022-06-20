import { createContext, useState } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

interface NetworkContextInterface {
  network: WalletAdapterNetwork;
  setNetwork?: (network: WalletAdapterNetwork) => void;
}

const NetworkContext = createContext<NetworkContextInterface>({
  network: WalletAdapterNetwork.Mainnet,
});

const NetworkContextProvider = ({ children }: { children: JSX.Element }) => {
  const [network, setNetwork] = useState(WalletAdapterNetwork.Mainnet);
  return (
    <NetworkContext.Provider
      value={{
        network,
        setNetwork,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkContext;

export { NetworkContextProvider };
