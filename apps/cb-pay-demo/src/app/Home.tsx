import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Paper,
  Typography,
} from '@mui/material';

export const Home = () => (
  <Container>
    <Typography variant="h1" component="h2">
      Welcome
    </Typography>
    <Typography variant="subtitle1" component="h3">
      Here is our conference one liner
    </Typography>
    <Button variant="contained">Button Example</Button>
    <br />
    <br />
    <Paper>
      Paper section <br />
      more info <br />
      and more <br />
      and more
      <br /> yo
    </Paper>
    <br />
    <br />
    <Card>
      <CardHeader title="Card Title" />
      <CardContent>Card Example</CardContent>
    </Card>
  </Container>
);
