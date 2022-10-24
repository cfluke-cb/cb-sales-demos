import { useContext, useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  Stack,
  CardHeader,
  Button,
} from '@mui/material';
import {
  useWallet,
  WalletAdapterNetwork,
  WalletName,
} from '@cb-sales-demos/wallet-sol';
import { NetworkContext } from '@cb-sales-demos/wallet-sol';
import { PageContainer } from '../components/PageContainer';
import { WalletStatus } from '../components/Wallet/WalletStatus';
import { CodeCard } from '../components/CodeCard';
import { ConnectBtn } from '../components/Wallet/ConnectBtn';
import { AccountInfo } from '../components/Wallet/AccountInfo';
import walletBlocks from '../snippets/wallet';
import { useNavigate } from 'react-router-dom';
import { WalletContext } from '@solana/wallet-adapter-react';
import {
  CoinbaseWalletName,
  PhantomWalletName,
} from '@solana/wallet-adapter-wallets';

const chainOptions = Object.keys(WalletAdapterNetwork)
  .filter((key: string) => isNaN(Number(key)))
  .map((key) => ({
    label: key,
    value: key === 'Mainnet' ? 'mainnet-beta' : key.toLowerCase(),
  }));

export const Wallet = () => {
  const navigate = useNavigate();
  const { network, setNetwork } = useContext(NetworkContext);
  const { wallets, select } = useContext(WalletContext);
  const { disconnectWallet, connected } = useWallet();
  const [phase, setPhase] = useState(0);
  const [walletName, setWalletName] = useState(CoinbaseWalletName.toString());

  const handleChainChange = (event: SelectChangeEvent) => {
    disconnectWallet();
    setNetwork?.(event.target.value as WalletAdapterNetwork);
  };

  const handleWalletChange = (event: SelectChangeEvent) => {
    console.log(event.target.value, CoinbaseWalletName.toString());
    setWalletName(event.target.value);
    console.log(
      'changing wallet',
      event.target.value,
      CoinbaseWalletName.toString(),
      PhantomWalletName.toString()
    );
    if (event.target.value !== walletName) {
      disconnectWallet();
    }
    if (event.target.value === CoinbaseWalletName.toString()) {
      select(CoinbaseWalletName);
    } else if (event.target.value === PhantomWalletName.toString()) {
      select(PhantomWalletName);
    }
  };

  const handleNavigate = () => {
    navigate('/chat');
  };

  return (
    <PageContainer>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Let's connect the Wallet" />
            <CardContent>
              <Stack spacing={3} paddingBottom={4}>
                <WalletStatus onClick={(i) => setPhase(i)} />
                <AccountInfo onClick={(i) => setPhase(i)} />
              </Stack>
              <Stack spacing={3} paddingBottom={2}>
                <FormControl fullWidth>
                  <InputLabel id="wallet-select=label">Wallet</InputLabel>
                  <Select
                    labelId="wallet-select-label"
                    value={walletName}
                    label="Wallet"
                    onChange={handleWalletChange}
                  >
                    {wallets.map((c, i) => (
                      <MenuItem
                        value={c.adapter.name}
                        key={'wallet-select-op-' + i}
                      >
                        {c.adapter.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="chain-select=label">Chain</InputLabel>
                  <Select
                    labelId="chain-select-label"
                    value={network}
                    label="Chain"
                    onChange={handleChainChange}
                  >
                    {chainOptions.map((c, i) => (
                      <MenuItem value={c.value} key={'chain-select-op-' + i}>
                        {c.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <Grid container gap={2} flexDirection="column">
                <ConnectBtn walletName={walletName} />
                {connected && (
                  <Button variant="contained" onClick={handleNavigate}>
                    Onward to Chat
                  </Button>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <CodeCard blocks={walletBlocks} updatePhase={phase} />
        </Grid>
      </Grid>
    </PageContainer>
  );
};
