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
} from '@mui/material';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import { PageContainer } from '../components/PageContainer';
import { WalletStatus } from '../components/WalletStatus';
import NetworkContext from '../context/networkProvider';
import { CodeCard } from '../components/CodeCard';
import { ConnectBtn } from '../components/ConnectBtn';
import { AccountInfo } from '../components/AccountInfo';
import walletBlocks from '../snippets/wallet';

const chainOptions = Object.keys(WalletAdapterNetwork)
  .filter((key: string) => isNaN(Number(key)))
  .map((key) => ({
    label: key,
    value: key === 'Mainnet' ? 'mainnet-beta' : key.toLowerCase(),
  }));

export const Wallet = () => {
  const { network, setNetwork } = useContext(NetworkContext);
  const { disconnect } = useWallet();
  const [phase, setPhase] = useState(0);

  const handleChainChange = (event: SelectChangeEvent) => {
    disconnect();
    setNetwork?.(event.target.value as WalletAdapterNetwork);
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
              <br />
              <br />
              <ConnectBtn />
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
