import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Typography,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/wallet');
  };

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="Welcome LaunchHouse"
              subtitle="Let's Connect our Wallet and Chat"
            />
            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                minHeight: 450,
              }}
            >
              <div style={{ margin: 'auto', paddingBottom: 8 }}>
                <img
                  src="https://static-assets.coinbase.com/design-system/illustrations/dark/collectingNfts-0.svg"
                  alt="collectingNfts"
                  width="240"
                  height="240"
                />
              </div>
              <Button
                variant="contained"
                onClick={handleNavigate}
                sx={{ marginBottom: 6 }}
              >
                Let's go
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item container xs={12} md={8} spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Introduction to Wallet" />
              <CardContent
                sx={{
                  display: 'flex',
                }}
              >
                <div style={{ margin: 8 }}>
                  <img
                    src="https://static-assets.coinbase.com/design-system/illustrations/dark/multipleAccountsWalletsForOneUser-0.svg"
                    alt="collectingNfts"
                    width="64"
                    height="64"
                  />
                </div>
                <Typography>
                  A fully fledged Web3 browser, multi-coin crypto, non-custodial
                  wallet
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Introduction to Pay" />
              <CardContent
                sx={{
                  display: 'flex',
                }}
              >
                <div style={{ margin: 8 }}>
                  <img
                    src="https://static-assets.coinbase.com/design-system/illustrations/dark/addPayment-1.svg"
                    alt="paymentLogo"
                    width="64"
                    height="64"
                  />
                </div>
                <Typography>
                  Fiat-to-crypto made fast, easy, and secure
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Let's utilize the Wallet for E2EE Chat" />
              <CardContent
                sx={{
                  display: 'flex',
                }}
              >
                <div style={{ margin: 8 }}>
                  <img
                    src="https://static-assets.coinbase.com/design-system/illustrations/dark/chat-1.svg"
                    alt="chat"
                    width="64"
                    height="64"
                  />
                </div>
                <Typography>
                  A fully fledged Web3 browser, multi-coin crypto, non-custodial
                  wallet
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
