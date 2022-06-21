import React, { useContext, useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import { ChatContext } from '../../context/ChatContext';
import { EncodedMessages } from './EncodedMessages';

export const SendRow = () => {
  const { sendMessage } = useContext(ChatContext);
  const [message, setMessage] = useState('');

  const handleSend = (e: React.SyntheticEvent) => {
    e?.preventDefault?.();
    sendMessage?.(message);
    setMessage('');
  };

  return (
    <Grid container item spacing={2}>
      <form onSubmit={handleSend} style={{ width: '100%' }}>
        <Grid container item spacing={2}>
          <Grid item xs={10}>
            <TextField
              id="standard-basic"
              label="Send Message"
              variant="standard"
              fullWidth
              value={message}
              onChange={(ev) => {
                setMessage(ev.target.value);
              }}
            />
          </Grid>
          <Grid item xs={2} alignSelf="center">
            <Button variant="contained" onClick={handleSend}>
              Send
            </Button>
          </Grid>
        </Grid>
      </form>
      <EncodedMessages />
    </Grid>
  );
};
