import { useRef, useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { sign, box } from 'tweetnacl';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Divider,
  Grid,
  List,
  ListItem,
  TextField,
  Box,
} from '@mui/material';

export const Chat = () => {
  const { connection } = useConnection();
  const { publicKey, signMessage } = useWallet();
  const [message, setMessage] = useState('');
  const [lastEncodedMessage, setLastEncodedMessage] = useState('');

  const handleSend = () => {
    const send = async () => {
      try {
        // `publicKey` will be null if the wallet isn't connected
        if (!publicKey) throw new Error('Wallet not connected!');
        // `signMessage` will be undefined if the wallet doesn't support it
        if (!signMessage)
          throw new Error('Wallet does not support message signing!');

        // Encode anything as bytes
        const encMessage = new TextEncoder().encode(message);
        // Sign the bytes using the wallet
        const signature = await signMessage(encMessage);
        // Verify that the bytes were signed using the private key that matches the known public key
        if (!sign.detached.verify(encMessage, signature, publicKey.toBytes()))
          throw new Error('Invalid signature!');
        const msgSig = bs58.encode(signature);
        console.log('success', `Message signature: ${msgSig}`, publicKey);
        setLastEncodedMessage(msgSig);
      } catch (error: any) {
        console.log('error', `Signing failed: ${error?.message}`);
      }
    };
    console.log('sending message', message);
    send();
  };

  return (
    <Container>
      <Typography variant="h3">Let's get Chatting</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button variant="contained">Request room access</Button>
                  <List>
                    <ListItem>Message 1</ListItem>
                    <ListItem>Message 2</ListItem>
                    <ListItem>Message 3</ListItem>
                  </List>
                </Grid>
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
                  <Grid item xs={12}>
                    {lastEncodedMessage.length > 0 && (
                      <Typography variant="inherit" textOverflow="wrap">
                        Last Encoded Message Sent: <br />
                        {lastEncodedMessage}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
