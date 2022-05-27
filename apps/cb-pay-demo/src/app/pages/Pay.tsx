import { useRef, useState, useEffect } from 'react';
import { initOnRamp } from '@coinbase/cbpay-js';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Divider,
  Grid,
} from '@mui/material';

const appId = '';
const destWalletAddr = '';

interface CBPayInstanceType {
  open: () => void;
  destroy: () => void;
}

export const PayWithCoinbaseButton: React.FC = () => {
  const onrampInstance = useRef<CBPayInstanceType>();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState('');
  const [events, setEvents] = useState<Array<any>>([]);

  useEffect(() => {
    console.log('initializing');
    onrampInstance.current = initOnRamp({
      appId,
      widgetParameters: {
        destinationWallets: [
          {
            address: destWalletAddr,
            //blockchains: ['ethereum', 'avalanche-c-chain'],
            assets: ['ETH', 'USDC'],
          },
        ],
      },
      onReady: () => {
        setIsReady(true);
      },
      onSuccess: () => {
        console.log('success');
      },
      onExit: (event: any) => {
        console.log('exit', event);
        if (event?.error) setError(event.error);
      },
      onEvent: (event: any) => {
        console.log('event', event);
        events.push(event);
        console.log('settings events', events);
        setEvents(events);
      },
      experienceLoggedIn: 'embedded', //'embedded', 'popup', or 'newtab',
      experienceLoggedOut: 'embedded',
      closeOnExit: true,
      closeOnSuccess: true,
    });
    console.log('initialized', onrampInstance);
    return () => {
      onrampInstance.current?.destroy();
    };
  }, []);

  const handleClick = () => {
    console.log(onrampInstance);
    onrampInstance.current?.open();
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClick} disabled={!isReady}>
        Add crypto with Pay
      </Button>
      {error !== '' ? <Typography variant="inherit">{error}</Typography> : null}
      <h3>Events List</h3>
      <Stack gap={1}>
        {events.map((e, i) => {
          return (
            <>
              <Typography variant="inherit" key={'eventListItem-' + i}>
                {JSON.stringify(e, null, 2)}
              </Typography>
              {i !== events.length - 1 ? (
                <Divider orientation="horizontal" />
              ) : null}
            </>
          );
        })}
      </Stack>
    </div>
  );
};

export const Pay = () => {
  return (
    <Container>
      <Typography variant="h3">Let's add Pay</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <PayWithCoinbaseButton />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
