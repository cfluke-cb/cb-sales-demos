import { useRef, useState, useEffect } from 'react';
import { initOnRamp, generateOnRampURL } from '@coinbase/cbpay-js';
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
  TextField,
  FormControl,
} from '@mui/material';
import { useWallet } from '@cb-sales-demos/wallet-sol';

import { PageContainer } from '../components/PageContainer';
import { CodeCard } from '../components/CodeCard';
import payBlocks from '../snippets/pay';
import { WalletConnectCheck } from '../components/WalletConnectCheck';
import {
  SelectExperience,
  Experience,
} from '../components/Pay/SelectExperience';
import {
  SelectBlockchain,
  SupportedBlockchains,
} from '../components/Pay/SelectBlockchain';
import { SelectAssets } from '../components/Pay/SelectAsset';
import { SelectSupportedNetwork } from '../components/Pay/SelectSupportedNetwork';

const appId = process.env['NX_CBPAY_APPID'] || 'did not work';
const defaultExperience = 'embedded' as Experience;
const defaultChains = ['solana'] as SupportedBlockchains[];
const defaultAssets = [] as string[];
const devMode = localStorage.getItem('devMode') === 'true';

interface CBPayInstanceType {
  open: () => void;
  destroy: () => void;
}

type Wallet = {
  address: string;
  assets?: string | string[];
  blockchains?: string | string[];
  supportedNetworks?: string | string[];
};

const createInitParams = (
  assets: string | string[],
  blockchains: string | string[],
  supportedNetwork: string | string[],
  walletAddr: string
) => {
  const destinationWallets: Wallet[] = [];
  if (assets.length > 0 && blockchains.length > 0) {
    if (assets.length === 1 && assets[0] === 'ETH') {
      destinationWallets.push({
        address: walletAddr,
        assets,
      });
    } else {
      destinationWallets.push({
        address: walletAddr,
        blockchains,
        assets,
      });
    }
  } else if (assets.length > 0) {
    if (assets.length === 1 && assets[0] === 'USDC') {
      destinationWallets.push({
        address: walletAddr,
        assets,
      });
    } else if (assets.length === 1 && assets[0] === 'ETH') {
      destinationWallets.push({
        address: walletAddr,
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

  if (supportedNetwork.length > 0) {
    destinationWallets.forEach((w) => {
      w.supportedNetworks = supportedNetwork;
    });
  }

  if (devMode) console.log('setting init params wallets', destinationWallets);
  return destinationWallets;
};

export const PayWithCoinbaseButton = ({
  experience,
  walletAddr,
  blockchains,
  assets,
  supportedNetworks,
  presetCrypto,
  presetFiat,
  handleOpen,
  handleExit,
  isOpen,
}: {
  experience: Experience;
  walletAddr: string;
  blockchains: SupportedBlockchains[];
  assets: string[];
  supportedNetworks: string[];
  presetCrypto: number;
  presetFiat: number;
  handleOpen: () => void;
  handleExit: () => void;
  isOpen: boolean;
}) => {
  const onrampInstance = useRef<CBPayInstanceType>();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState('');
  const [events, setEvents] = useState<Array<any>>([]);

  useEffect(() => {
    if (devMode) console.log('initializing onramp embed');
    const destinationWallets = createInitParams(
      assets,
      blockchains,
      supportedNetworks,
      walletAddr
    );

    const widgetParameters: any = {
      destinationWallets,
      //defaultNetwork: 'polygon',
    };
    if (presetCrypto !== 0) widgetParameters.presetCryptoAmount = presetCrypto;
    if (presetFiat !== 0) widgetParameters.presetFiatAmount = presetFiat;
    const initConfig = {
      appId,
      widgetParameters,
      onSuccess: () => {
        console.log('success');
        handleExit();
      },
      onExit: (event: any) => {
        console.log('exit', event);
        if (event?.error) setError(event.error);
        handleExit();
      },
      onEvent: (event: any) => {
        if (!isOpen && event?.eventName !== 'exit') handleOpen();
        console.log('event', event);
        setEvents((events) => [...events, event]);
      },
      experienceLoggedIn: experience, //'embedded', 'popup', or 'newtab',
      experienceLoggedOut: experience,
      closeOnExit: true,
      closeOnSuccess: true,
    };
    console.log('trying to destroy instance', onrampInstance?.current);
    onrampInstance?.current?.destroy();
    setIsReady(false);
    console.log('starting initOnRamp', initConfig);
    initOnRamp(initConfig, (error, instance) => {
      if (instance) {
        onrampInstance.current = instance;
        setIsReady(true);
      }
      if (error) {
        console.error(error);
      }

      if (devMode) console.log('initialized onramp embed', onrampInstance);
    });

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
  const { publicKey } = useWallet();
  const walletAddr = publicKey?.toBase58();
  const [isOpen, setIsOpen] = useState(false);
  const [experienceType, setExperienceType] =
    useState<Experience>(defaultExperience);
  const [selectedBlockchains, setSelectedBlockchains] =
    useState<SupportedBlockchains[]>(defaultChains);
  const [selectedAssets, setSelectedAssets] = useState<string[]>(defaultAssets);
  const [selectedSupportedNetwork, setSelectedSupportedNetwork] = useState<
    string[]
  >([]);
  const [presetCrypto, setPresetCrypto] = useState(0);
  const [presetFiat, setPresetFiat] = useState(0);
  const [overrideWalletAddr, setOverrideWalletAddr] = useState(
    walletAddr || ''
  );

  useEffect(() => {
    if (overrideWalletAddr === '' && walletAddr) {
      setOverrideWalletAddr(walletAddr);
    }
  }, [walletAddr, overrideWalletAddr]);

  const handleReset = () => {
    setSelectedBlockchains(defaultChains);
    setSelectedAssets(defaultAssets);
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleExit = () => {
    setIsOpen(false);
  };

  const genOnRamp = () => {
    if (!overrideWalletAddr) return;
    const destinationWallets = createInitParams(
      selectedAssets,
      selectedBlockchains,
      selectedSupportedNetwork,
      overrideWalletAddr
    );

    const urlParams: any = {
      appId,
      destinationWallets,
    };
    if (presetCrypto !== 0) urlParams.presetCryptoAmount = presetCrypto;
    if (presetFiat !== 0) urlParams.presetFiatAmount = presetFiat;

    console.log('generateOnRampURL params', urlParams);
    const url = generateOnRampURL(urlParams);
    window.open(url, 'blank');
  };

  return (
    <PageContainer>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Let's add Pay" />
            <CardContent>
              <FormGroup>
                {!isOpen ? (
                  <>
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
                        <SelectSupportedNetwork
                          selectedAssets={selectedSupportedNetwork}
                          setSelectedAssets={setSelectedSupportedNetwork}
                        />
                        <FormControl fullWidth sx={{ m: 1 }}>
                          <TextField
                            type="text"
                            label="Destination Wallet Address"
                            value={overrideWalletAddr}
                            onChange={(e) =>
                              setOverrideWalletAddr(e.target.value)
                            }
                          />
                        </FormControl>
                        <FormControl fullWidth sx={{ m: 1 }}>
                          <TextField
                            type="number"
                            label="Preset Crypto"
                            value={presetCrypto}
                            onChange={(e) =>
                              setPresetCrypto(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormControl fullWidth sx={{ m: 1 }}>
                          <TextField
                            type="number"
                            label="Preset Fiat"
                            value={presetFiat}
                            onChange={(e) =>
                              setPresetFiat(Number(e.target.value))
                            }
                          />
                        </FormControl>
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
                  </>
                ) : null}
              </FormGroup>

              <br />
              <br />
              {overrideWalletAddr !== '' && (
                <>
                  <PayWithCoinbaseButton
                    experience={experienceType}
                    walletAddr={overrideWalletAddr}
                    blockchains={selectedBlockchains}
                    assets={selectedAssets}
                    supportedNetworks={selectedSupportedNetwork}
                    presetCrypto={presetCrypto}
                    presetFiat={presetFiat}
                    handleOpen={handleOpen}
                    handleExit={handleExit}
                    isOpen={isOpen}
                  />
                  {devMode && (
                    <Button variant="contained" onClick={genOnRamp}>
                      GenerateOnRampURL
                    </Button>
                  )}
                </>
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
