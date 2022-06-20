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
  Link,
} from '@mui/material';
import { PageContainer } from '../components/PageContainer';
import { CodeCard } from '../components/CodeCard';
import payBlocks from '../snippets/pay';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletConnectCheck } from '../components/WalletConnectCheck';
import { SelectExperience, Experience } from '../components/SelectExperience';
import {
  SelectBlockchain,
  SupportedBlockchains,
} from '../components/SelectBlockchain';
import { SelectAssets } from '../components/SelectAsset';

const appId = '%NX_CBPAY_APPID%';
const ethWalletAddr = '0x01658f5d899e03492dC832C8eE8839FFD80b7f09';
const defaultExperience = 'embedded' as Experience;
const defaultChains = ['solana'] as SupportedBlockchains[];
const defaultAssets = [] as string[];
const devMode = localStorage.getItem('devMode') === 'true';

interface CBPayInstanceType {
  open: () => void;
  destroy: () => void;
}

export const PayWithCoinbaseButton = ({
  experience,
  walletAddr,
  blockchains,
  assets,
}: {
  experience: Experience;
  walletAddr: string;
  blockchains: SupportedBlockchains[];
  assets: string[];
}) => {
  const onrampInstance = useRef<CBPayInstanceType>();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState('');
  const [events, setEvents] = useState<Array<any>>([]);

  useEffect(() => {
    console.log('initializing');
    const destinationWallets = [];
    if (assets.length > 0 && blockchains.length > 0) {
      destinationWallets.push({
        address: walletAddr,
        blockchains,
        assets,
      });
    } else if (assets.length > 0) {
      if (assets.indexOf('usdc') > -1 || assets.indexOf('eth') > -1) {
        destinationWallets.push({
          address: ethWalletAddr,
          assets,
        });
      } else {
        destinationWallets.push({
          address: walletAddr,
          assets,
        });
      }
    } else if (blockchains.length > 0) {
      destinationWallets.push({
        address: walletAddr,
        blockchains,
      });
    }
    onrampInstance.current = initOnRamp({
      appId,
      widgetParameters: {
        destinationWallets,
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
  }, [experience, walletAddr, assets, blockchains]);

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
  const [experienceType, setExperienceType] =
    useState<Experience>(defaultExperience);
  const [selectedBlockchains, setSelectedBlockchains] =
    useState<SupportedBlockchains[]>(defaultChains);
  const [selectedAssets, setSelectedAssets] = useState<string[]>(defaultAssets);
  const { publicKey } = useWallet();
  const walletAddr = publicKey?.toBase58();

  const handleReset = () => {
    setSelectedBlockchains(defaultChains);
    setSelectedAssets(defaultAssets);
  };

  return (
    <PageContainer>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Let's add Pay" />
            <CardContent>
              <FormGroup>
                <SelectExperience
                  experience={experienceType}
                  setExperience={setExperienceType}
                />
                {devMode && (
                  <>
                    <SelectBlockchain
                      setSelectedBlockchains={setSelectedBlockchains}
                      selectedBlockchains={selectedBlockchains}
                    />
                    <SelectAssets
                      selectedAssets={selectedAssets}
                      setSelectedAssets={setSelectedAssets}
                    />
                    <Typography variant="inherit" sx={{ m: 1 }}>
                      <Link
                        component="button"
                        variant="body2"
                        color="secondary"
                        onClick={handleReset}
                      >
                        Reset
                      </Link>
                    </Typography>
                  </>
                )}
              </FormGroup>

              <br />
              <br />
              {walletAddr && (
                <PayWithCoinbaseButton
                  experience={experienceType}
                  walletAddr={walletAddr}
                  blockchains={selectedBlockchains}
                  assets={selectedAssets}
                />
              )}
              <WalletConnectCheck />
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
