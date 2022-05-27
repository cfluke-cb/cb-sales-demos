import { useEffect, useState, useContext } from 'react';
import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PhantomWalletName } from '@solana/wallet-adapter-phantom';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
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
  console.log('chain options', chainOptions, network);

  let walletAddr = null;
  if (publicKey) {
    walletAddr = publicKey?.toBase58();
  }

  return (
    <Container>
      <Typography variant="h3">Connect Dat Wallet</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              Some wallet options here, do we need any?
              <WalletStatus />
              {walletAddr && (
                <Typography variant="inherit">
                  Wallet Address: {walletAddr}
                </Typography>
              )}
              {account?.fmtBalance && (
                <Typography variant="inherit">
                  Balance: {account.fmtBalance}
                </Typography>
              )}
              <br />
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
    </Container>
  );
};
