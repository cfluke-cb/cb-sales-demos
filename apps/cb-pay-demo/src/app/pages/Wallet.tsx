import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PhantomWalletName } from '@solana/wallet-adapter-phantom';
import { WalletStatus } from '../components/WalletStatus';

export const Wallet = () => {
  const { connection } = useConnection();
  const {
    publicKey,
    wallets,
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
      };

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

  return (
    <Container>
      <Typography variant="h3">Connect Dat Wallet</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              Some wallet options here, do we need any?
              <WalletStatus />
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
