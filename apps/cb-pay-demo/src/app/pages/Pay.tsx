import { useRef, useState, useEffect } from 'react';
import { initOnRamp } from '@coinbase/cbpay-js';
import {
  CardHeader,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Divider,
  Grid,
  FormGroup,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { PageContainer } from '../components/PageContainer';
import { CodeCard } from '../components/CodeCard';
import payBlocks from '../snippets/pay';

const appId = '';
const destWalletAddr = '';

interface CBPayInstanceType {
  open: () => void;
  destroy: () => void;
}

type Experience = 'embedded' | 'popup' | 'new_tab';

export const PayWithCoinbaseButton = ({
  experience,
}: {
  experience: Experience;
}) => {
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
            blockchains: ['solana'],
            //assets: ['ETH', 'USDC'],
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
        setEvents((events) => [...events, event]);
      },
      experienceLoggedIn: experience, //'embedded', 'popup', or 'newtab',
      experienceLoggedOut: experience,
      closeOnExit: true,
      closeOnSuccess: true,
    });
    console.log('initialized', onrampInstance);
    return () => {
      onrampInstance.current?.destroy();
    };
  }, [experience]);

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

const expOptions = [
  { label: 'Embedded', value: 'embedded' },
  { label: 'Pop-up', value: 'popup' },
  { label: 'New Tab', value: 'new_tab' },
];

export const Pay = () => {
  const [experienceType, setExperienceType] = useState<Experience>('embedded');

  return (
    <PageContainer>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Let's add Pay" />
            <CardContent>
              <FormGroup>
                <FormControl fullWidth>
                  <InputLabel id="exp-select=label">Experience</InputLabel>
                  <Select
                    labelId="exp-select-label"
                    value={experienceType}
                    label="Experience"
                    onChange={(e) =>
                      setExperienceType(e.target.value as Experience)
                    }
                  >
                    {expOptions.map((c) => (
                      <MenuItem value={c.value}>{c.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormGroup>
              <br />
              <br />
              <PayWithCoinbaseButton experience={experienceType} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <CodeCard blocks={payBlocks} updatePhase={0} />
        </Grid>
      </Grid>
    </PageContainer>
  );
};
