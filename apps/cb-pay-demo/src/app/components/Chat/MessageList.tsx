import { useContext, useEffect, useRef } from 'react';
import {
  Grid,
  List,
  ListItem,
  Avatar,
  Tooltip,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { ChatContext } from '../../context/ChatContext';
import { MembersRow } from './MembersRow';
import { SendRow } from './SendRow';

export const MessageList = () => {
  const { sessionConnected, messages } = useContext(ChatContext);
  const scrollRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!sessionConnected) return null;
  return (
    <>
      <MembersRow />
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
                  <Avatar>{m.alias.slice(0, 1).toUpperCase()}</Avatar>
                </Tooltip>
              </ListItemAvatar>
              <ListItemText primary={m.body} />
            </ListItem>
          ))}
        </List>
      </Grid>
      <SendRow />
    </>
  );
};
