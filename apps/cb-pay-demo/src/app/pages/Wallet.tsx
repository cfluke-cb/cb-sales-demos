import { useEffect, useState, useContext } from 'react';
import {
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  Stack,
  CardHeader,
} from '@mui/material';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PhantomWalletName } from '@solana/wallet-adapter-phantom';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PageContainer } from '../components/PageContainer';
import { WalletStatus } from '../components/WalletStatus';
import NetworkContext from '../context/networkProvider';

const chainOptions = Object.keys(WalletAdapterNetwork)
  .filter((key: string) => isNaN(Number(key)))
  .map((key) => ({
    label: key,
    value: key === 'Mainnet' ? 'mainnet-beta' : key.toLowerCase(),
  }));

export const Wallet = () => {
  const { connection } = useConnection();
  const { network, setNetwork } = useContext(NetworkContext);
  const {
    publicKey,
    select,
    wallet,
    connect,
    disconnect,
    connecting,
    connected,
    disconnecting,
  } = useWallet();
  const [account, setAccount] = useState<any | null>(null);

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
    console.log('new wallet', wallet);
  }, [wallet]);

  const handleWalletConnect = () => {
    console.log('attempting connect', connection, connecting, connected);
    if (connecting || connected) return;
    select(PhantomWalletName);
    connect().catch((err) => {
      // Silently catch because any errors are caught by the context `onError` handler
      console.log('error connecting', err);
    });
  };

  const handleWalletDisconnect = () => {
    console.log('attempting disconnect');
    if (disconnecting) return;
    disconnect();
    setAccount(null);
  };

  const handleChainChange = (event: SelectChangeEvent) => {
    disconnect();
    setNetwork?.(event.target.value as WalletAdapterNetwork);
    setAccount(null);
  };

  const walletAddr = publicKey?.toBase58();

  return (
    <PageContainer>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Let's connect the Wallet" />
            <CardContent>
              <Stack spacing={3} paddingBottom={4}>
                <WalletStatus />
                {walletAddr && (
                  <>
                    <Typography variant="inherit" fontWeight={600}>
                      Address:
                      <Typography
                        variant="inherit"
                        textOverflow={'ellipsis'}
                        fontWeight={400}
                        paddingLeft={2}
                        overflow="hidden"
                      >
                        {walletAddr}
                      </Typography>
                    </Typography>
                    <Typography variant="inherit" fontWeight={600}>
                      Balance:
                      <Typography
                        variant="inherit"
                        textOverflow={'ellipsis'}
                        fontWeight={400}
                        paddingLeft={2}
                        overflow="hidden"
                      >
                        {account?.fmtBalance || 0}
                      </Typography>
                    </Typography>
                  </>
                )}
              </Stack>
              <FormControl fullWidth>
                <InputLabel id="chain-select=label">Chain</InputLabel>
                <Select
                  labelId="chain-select-label"
                  value={network}
                  label="Chain"
                  onChange={handleChainChange}
                >
                  {chainOptions.map((c) => (
                    <MenuItem value={c.value}>{c.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <br />
              <br />
              {connected ? (
                <Button
                  variant="contained"
                  onClick={handleWalletDisconnect}
                  disabled={disconnecting}
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleWalletConnect}
                  disabled={connecting || connected}
                >
                  Connect
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          {account && (
            <Card>
              <CardContent>
                Account Info: {JSON.stringify(account, null, 2)}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </PageContainer>
  );
};
