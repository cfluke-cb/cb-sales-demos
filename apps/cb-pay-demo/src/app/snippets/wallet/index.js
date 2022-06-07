import block1 from './walletProvider';
import block2 from './app';
import block3 from './connectBtn';
import block4 from './walletStatus';
import block5 from './accountInfo';

const phases = [
  {
    description: 'Setup Wallet Provider',
    snippet: block1,
  },
  {
    description: 'Wrap Router with Provider',
    snippet: block2,
  },
  {
    description: 'Add Connect Button',
    snippet: block3,
  },
  {
    description: 'Utilize Connection Status',
    snippet: block4,
  },
  {
    description: 'Fetch Account Details',
    snippet: block5,
  },
];

export default phases;
