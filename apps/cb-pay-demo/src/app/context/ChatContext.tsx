import { createContext, useState, useEffect } from 'react';
import { useWallet } from '@cb-sales-demos/sol-wallet';
import { box, randomBytes, sign } from 'tweetnacl';
import base58 from 'bs58';
import {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64,
} from 'tweetnacl-util';
import { connect as connectWS, sendMsg } from '../services/chatWS';

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

interface ChatContextInterface {
  alias: string;
  sessionConnected: boolean;
  members: ChatMember[];
  messages: ChatMessage[];
  lastDecodedMessage: string;
  lastEncodedMessage: string;
  lastEncodedRecvMessage: string;
  connect?: (alias: string) => void;
  sendMessage?: (message: string) => void;
}

const ChatContext = createContext<ChatContextInterface>({
  alias: '',
  sessionConnected: false,
  members: [],
  messages: [],
  lastDecodedMessage: '',
  lastEncodedMessage: '',
  lastEncodedRecvMessage: '',
});

const ChatContextProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const { publicKey, signMessage } = useWallet();
  const [alias, setAlias] = useState('');
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

  const connect = async (name: string) => {
    if (!name || name === '' || !publicKey) {
      console.warn('no alias set');
      return;
    }
    setAlias(name);
    const kp = box.keyPair() as SessionKeyPair;
    setSessionKeyPair(kp);
    // connect to server and share session key pair for e2ee

    const sigArray = await signMessage?.(
      decodeUTF8(publicKey.toBase58() + ':' + name)
    );
    if (!sigArray) {
      console.warn('could not get signed message', sigArray, signMessage);
      return;
    }

    try {
      const socket = await connectWS(
        name,
        base58.encode(kp.publicKey),
        base58.encode(sigArray),
        publicKey.toBase58()
      );
      if (socket instanceof Event) {
        setSessionConnected(false);
        console.log('error connecting to ws', socket);
      } else {
        setSessionConnected(true);

        socket.onmessage = (message: any) => {
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
            if (msg.alias === name) {
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
            console.log('send message', msg, msg.to === name);

            if (msg.to === name) {
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

  const sendMessage = (message: string) => {
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
      } catch (error: any) {
        console.log('error', `Signing failed: ${error?.message}`);
      }
    };
    console.log('sending message', message);
    send();
  };

  return (
    <ChatContext.Provider
      value={{
        alias,
        sessionConnected,
        members,
        messages,
        lastDecodedMessage,
        lastEncodedMessage,
        lastEncodedRecvMessage,
        connect,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatContextProvider, ChatContext };
