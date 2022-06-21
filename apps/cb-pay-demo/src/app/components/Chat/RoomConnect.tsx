import { useContext, useState } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { Grid, TextField, Button } from '@mui/material';
import { WalletConnectCheck } from '../WalletConnectCheck';
import { useWallet } from '@cb-sales-demos/sol-wallet';

export const RoomConnect = () => {
  const { connected } = useWallet();
  const { connect, sessionConnected } = useContext(ChatContext);
  const [name, setName] = useState('');

  const handleRoomAccess = async (e: React.SyntheticEvent) => {
    e?.preventDefault?.();
    connect?.(name);
  };

  if (sessionConnected) return <></>;

  return (
    <form onSubmit={handleRoomAccess}>
      <Grid container item spacing={2}>
        <Grid item xs={12}>
          <TextField
            id="alias-input"
            label="Chat Alias"
            variant="standard"
            fullWidth
            value={name}
            onChange={(ev) => {
              setName(ev.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleRoomAccess}
            disabled={!connected || name === ''}
          >
            Request room access
          </Button>
          <WalletConnectCheck />
        </Grid>
      </Grid>
    </form>
  );
};
