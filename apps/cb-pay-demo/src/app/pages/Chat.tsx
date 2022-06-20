import { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { box, randomBytes, sign } from 'tweetnacl';
import base58 from 'bs58';
import {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64,
} from 'tweetnacl-util';
import {
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  List,
  ListItem,
  TextField,
  Tooltip,
  Avatar,
  AvatarGroup,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import { connect, sendMsg } from '../services/chatWS';
import { PageContainer } from '../components/PageContainer';
import { WalletConnectCheck } from '../components/WalletConnectCheck';

type SessionKeyPair = {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
};

type ChatMember = {
  publicKey: Uint8Array;
  alias: string;
  walletAddr: string;
  sig: Uint8Array;
  validSig: boolean;
};

type ChatMessage = {
  to: string;
  alias: string;
  body: string;
  walletAddr: string;
};

export const Chat = () => {
  const { publicKey, connected, signMessage } = useWallet();
  const scrollRef = useRef<HTMLLIElement | null>(null);
  const [alias, setAlias] = useState('');
  const [message, setMessage] = useState('');
  const [members, setMembers] = useState<ChatMember[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastDecodedMessage, setlastDecodedMessage] = useState('');
  const [lastEncodedMessage, setLastEncodedMessage] = useState('');
  const [lastEncodedRecvMessage, SetLastEncodedRecvMessage] = useState('');
  const [inboundMessage, setInboundMessage] = useState<ChatMessage | null>(
    null
  );
  const [sessionKeyPair, setSessionKeyPair] = useState<SessionKeyPair>();

  const [sessionConnected, setSessionConnected] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleRoomAccess = async (e: React.SyntheticEvent) => {
    if (e?.preventDefault) e.preventDefault();
    if (!alias || alias === '' || !publicKey) {
      console.warn('no alias set');
      return;
    }
    const kp = box.keyPair() as SessionKeyPair;
    setSessionKeyPair(kp);
    // connect to server and share session key pair for e2ee

    const sigArray = await signMessage?.(
      decodeUTF8(publicKey.toBase58() + ':' + alias)
    );
    if (!sigArray) {
      console.warn('could not get signed message', sigArray, signMessage);
      return;
    }

    try {
      const socket = await connect(
        alias,
        base58.encode(kp.publicKey),
        base58.encode(sigArray),
        publicKey.toBase58()
      );
      if (socket instanceof Event) {
        setSessionConnected(false);
        console.log('error connecting to ws', socket);
      } else {
        setSessionConnected(true);

        socket.onmessage = (message) => {
          console.log('chat onmessage', message);
          const msg = JSON.parse(message.data);
          console.log('parsed onmessage', msg);
          if (msg.type === 'memberList') {
            const newMembers: ChatMember[] = [];
            msg.members.forEach((mem: any) => {
              const m = {
                alias: mem.alias,
                publicKey: base58.decode(mem.publicKey),
                walletAddr: mem.walletAddr,
                sig: base58.decode(mem.sig),
                validSig: false,
              };
              m.validSig = isValidSig(m);
              console.log('mem', mem, m);
              newMembers.push(m);
            });
            setMembers(newMembers);
            console.log('set members', newMembers);
          } else if (msg.type === 'connect') {
            if (msg.alias === alias) {
              console.log('ignoring own connection broadcast', msg);
              return;
            }
            try {
              const newMember = {
                alias: msg.alias,
                publicKey: base58.decode(msg.publicKey),
                walletAddr: msg.walletAddr,
                sig: base58.decode(msg.sig),
                validSig: false,
              };
              newMember.validSig = isValidSig(newMember);
              console.log('added new member', newMember);
              setMembers((members) => [...members, newMember]);
            } catch (err) {
              console.log('error validating sig', err, msg);
            }
          } else if (msg.type === 'send') {
            console.log('send message', msg, msg.to === alias);

            if (msg.to === alias) {
              SetLastEncodedRecvMessage(msg.body);
              setInboundMessage(msg);
            }
          } else if (msg.type === 'diconnect') {
            setMembers((members) =>
              members.filter((m) => m.alias === msg.alias)
            );
          }
        };
      }
    } catch (err) {
      console.error('error connecting to websocket', err);
      setSessionConnected(false);
    }
  };

  const isValidSig = (msg: ChatMember) => {
    let validSig = false;
    try {
      const signedMessage = decodeUTF8(msg.walletAddr + ':' + msg.alias);
      validSig = sign.detached.verify(
        signedMessage,
        msg.sig,
        base58.decode(msg.walletAddr)
      );
      console.log('valid sig?', validSig, signedMessage);
    } catch (err) {
      console.log('issue validating sig', err);
    }
    return validSig;
  };

  useEffect(() => {
    if (!sessionKeyPair || !inboundMessage) return;

    const encMessage = decodeBase64(inboundMessage.body);
    const nonce = encMessage.slice(0, box.nonceLength);
    const message = encMessage.slice(
      box.nonceLength,
      inboundMessage.body.length
    );
    const sender = members.find((m) => m.alias === inboundMessage.alias);
    console.log('message', encMessage, 'from', sender);
    if (!sender) {
      console.log('unknown sender', inboundMessage, members);
      return;
    }
    const decrypted = box.open(
      message,
      nonce,
      sender.publicKey,
      sessionKeyPair.secretKey
    );

    if (!decrypted) {
      console.log('issue decrypting', decrypted, nonce, encMessage);
      return;
    }
    try {
      const decryptMessage = encodeUTF8(decrypted);

      setlastDecodedMessage(decryptMessage);
      setMessages((messages) => [
        ...messages,
        {
          body: decryptMessage,
          to: inboundMessage.to,
          alias: inboundMessage.alias,
          walletAddr: sender.walletAddr,
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  }, [inboundMessage, sessionKeyPair, members]);

  const handleSend = () => {
    const send = async () => {
      try {
        // `publicKey` will be null if the wallet isn't connected
        if (!publicKey) throw new Error('Wallet not connected!');
        if (!sessionKeyPair?.publicKey)
          throw new Error('Session not connected!');

        // Encode anything as bytes
        const encMessage = decodeUTF8(message);

        members.forEach((member) => {
          if (member.walletAddr === publicKey.toBase58()) {
            console.log('not sending to self');
            return;
          }
          console.log('encoding message', encMessage, member.publicKey);
          const nonce = randomBytes(box.nonceLength);
          const encrypted = box(
            encMessage,
            nonce,
            member.publicKey,
            sessionKeyPair.secretKey
          );
          const fullMessage = new Uint8Array(nonce.length + encrypted.length);
          fullMessage.set(nonce);
          fullMessage.set(encrypted, nonce.length);
          const finalMessage = encodeBase64(fullMessage);
          setLastEncodedMessage(finalMessage);
          const sendBody = JSON.stringify({
            type: 'send',
            alias,
            body: finalMessage,
            to: member.alias,
          });

          sendMsg(sendBody);
        });
        setMessages([
          ...messages,
          {
            alias,
            body: message,
            to: 'everyone',
            walletAddr: publicKey?.toBase58(),
          },
        ]);
        setMessage('');
      } catch (error: any) {
        console.log('error', `Signing failed: ${error?.message}`);
      }
    };
    console.log('sending message', message);
    send();
  };

  return (
    <PageContainer>
      <Typography variant="h3">Let's get Chatting</Typography>
      <Grid container spacing={2} paddingTop={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Grid container spacing={2} padding={2}>
                {!sessionConnected && (
                  <form onSubmit={handleRoomAccess}>
                    <Grid container item spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          id="alias-input"
                          label="Chat Alias"
                          variant="standard"
                          fullWidth
                          value={alias}
                          onChange={(ev) => {
                            setAlias(ev.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          onClick={handleRoomAccess}
                          disabled={!connected || alias === ''}
                        >
                          Request room access
                        </Button>
                        <WalletConnectCheck />
                      </Grid>
                    </Grid>
                  </form>
                )}
                {sessionConnected && (
                  <>
                    <Grid container justifyContent="space-between" item xs={12}>
                      <Typography variant="h5">Connected as {alias}</Typography>
                      <AvatarGroup
                        max={5}
                        total={members.length}
                        sx={{ display: 'inline-flex' }}
                      >
                        {members.map((m, i) => (
                          <Tooltip
                            key={'group-avatar-item-' + i}
                            title={
                              <div>
                                Username: {m.alias}
                                <br />
                                Wallet Address: {m.walletAddr}
                                <br />
                                Valid Signature: {m.validSig.toString()}
                              </div>
                            }
                          >
                            <Avatar key={'av-member-' + i}>
                              {m.alias.slice(0, 1).toUpperCase()}
                            </Avatar>
                          </Tooltip>
                        ))}
                      </AvatarGroup>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      maxHeight={300}
                      minHeight={300}
                      textOverflow="ellipsis"
                      overflow="scroll"
                    >
                      <List>
                        {messages.map((m, i) => (
                          <ListItem
                            ref={messages.length - 1 === i ? scrollRef : null}
                            key={'msg-item-' + i}
                          >
                            <ListItemAvatar>
                              <Tooltip
                                title={
                                  <div>
                                    Username: {m.alias}
                                    <br />
                                    Wallet Address: {m.walletAddr}
                                  </div>
                                }
                              >
                                <Avatar>
                                  {m.alias.slice(0, 1).toUpperCase()}
                                </Avatar>
                              </Tooltip>
                            </ListItemAvatar>
                            <ListItemText primary={m.body} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
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
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};
