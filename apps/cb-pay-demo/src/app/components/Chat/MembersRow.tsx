import { useContext } from 'react';
import { Grid, Typography, AvatarGroup, Tooltip, Avatar } from '@mui/material';
import { ChatContext } from '../../context/ChatContext';

export const MembersRow = () => {
  const { alias, members } = useContext(ChatContext);
  return (
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
  );
};
