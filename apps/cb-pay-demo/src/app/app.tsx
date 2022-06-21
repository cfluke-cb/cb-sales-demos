import { createTheme, ThemeProvider } from '@mui/material';
import { WalletProvider } from '@cb-sales-demos/sol-wallet';
import { Router } from './routes';
import { ChatContextProvider } from './context/ChatContext';

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
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: 'darkgray',
        },
      },
    },
  },
});

export function App() {
  return (
    <ThemeProvider theme={mdTheme}>
      <WalletProvider>
        <ChatContextProvider>
          <Router />
        </ChatContextProvider>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;
