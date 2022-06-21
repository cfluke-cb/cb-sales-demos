import { Typography, Card, CardContent, Grid } from '@mui/material';
import { PageContainer } from '../components/PageContainer';
import { RoomConnect } from '../components/Chat/RoomConnect';
import { MessageList } from '../components/Chat/MessageList';

export const Chat = () => {
  return (
    <PageContainer>
      <Typography variant="h3">Let's get Chatting</Typography>
      <Grid container spacing={2} paddingTop={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Grid container spacing={2} padding={2}>
                <RoomConnect />
                <MessageList />
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};
