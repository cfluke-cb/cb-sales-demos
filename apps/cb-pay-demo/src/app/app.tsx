import { createTheme, ThemeProvider } from '@mui/material';
import { Router } from './routes';

const mdTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3C2AC3',
    },
    text: {
      primary: '#fff',
      secondary: '#9e9fa0',
    },
    background: {
      default: '#212224',
      paper: '#28292c',
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
  },
});

export function App() {
  return (
    <ThemeProvider theme={mdTheme}>
      <Router />
    </ThemeProvider>
  );
}

export default App;
