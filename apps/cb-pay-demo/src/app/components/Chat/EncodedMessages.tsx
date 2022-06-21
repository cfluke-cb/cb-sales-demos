import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { Grid, Typography } from '@mui/material';

export const EncodedMessages = () => {
  const { lastEncodedMessage, lastEncodedRecvMessage, lastDecodedMessage } =
    useContext(ChatContext);

  return (
    <>
      <Grid item xs={12}>
        {lastEncodedMessage.length > 0 && (
          <Typography variant="inherit" textOverflow="ellipsis">
            Last Encoded Message Sent: <br />
            {lastEncodedMessage}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12}>
        {lastEncodedRecvMessage.length > 0 && (
          <Typography variant="inherit" textOverflow="ellipsis">
            Last Encoded Message Received: <br />
            {lastEncodedRecvMessage}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12}>
        {lastDecodedMessage.length > 0 && (
          <Typography variant="inherit" textOverflow="ellipsis">
            Last Decoded Message Received: <br />
            {lastDecodedMessage}
          </Typography>
        )}
      </Grid>
    </>
  );
};
