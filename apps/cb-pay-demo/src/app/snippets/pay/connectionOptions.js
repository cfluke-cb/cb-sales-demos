const destWalletAddr = 'HWo...F3ZK'; // my address to receieve funds
const appId = '4e2...36'; // appId from Coinbase to connect with from my website's domain

export const payConfig = {
  appId,
  experienceLoggedIn: 'embedded', //'embedded', 'popup', or 'new_tab',
  experienceLoggedOut: 'popup',
  widgetParameters: {
    destinationWallets: [
      {
        address: destWalletAddr,
        //Blockchains Today
        //'algorand', 'avalanche-c-chain', 'bitcoin', 'bitcoin-cash', 'cardano', 'celo',
        //'cosmos', 'dash', 'dfinity', 'dogecoin', 'eos', 'ethereum', 'ethereum-classic',
        //'filecoin', 'horizen', 'litecoin', 'polkadot', 'solana', 'stellar', 'tezos', 'zcash'

        blockchains: ['solana'], //ethereum, avalanche-c-chain, solana today
        //assets: ['SOL', 'USDC'], //can also limit to specific asset
      },
    ],
  },
};

//'algorand', 'avalanche-c-chain', 'bitcoin', 'bitcoin-cash', 'cardano', 'celo', 'cosmos', 'dash', 'dfinity', 'dogecoin', 'eos', 'ethereum', 'ethereum-classic', 'filecoin', 'horizen', 'litecoin', 'polkadot', 'solana', 'stellar', 'tezos', 'zcash';

const snippet = `const destWalletAddr = 'HWo...F3ZK'; // my address to receieve funds
const appId = '4e2...36'; // appId from Coinbase to connect with from my website's domain

export const payConfig = {
  appId,
  experienceLoggedIn: 'embedded', //'embedded', 'popup', or 'new_tab',
  experienceLoggedOut: 'popup',
  widgetParameters: {
    destinationWallets: [
      {
        address: destWalletAddr,
        blockchains: ['solana'],
        //assets: ['SOL', 'USDC'], //can also limit to specific asset
      },
    ],
  },
};

//Blockchains Today
//'algorand', 'avalanche-c-chain', 'bitcoin', 'bitcoin-cash',
//'cardano', 'celo', 'cosmos', 'dash', 'dfinity',
//'dogecoin', 'eos', 'ethereum', 'ethereum-classic',
//'filecoin', 'horizen', 'litecoin', 'polkadot', 'solana',
//'stellar', 'tezos', 'zcash'

`;
export default snippet;
