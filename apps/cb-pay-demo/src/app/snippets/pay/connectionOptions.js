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
        blockchains: ['solana'],
        //assets: ['SOL', 'USDC'], //can also limit to specific asset
      },
    ],
  },
};

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
`;
export default snippet;
