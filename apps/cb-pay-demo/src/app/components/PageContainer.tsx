import { Container } from '@mui/material';
import { useLayoutContext } from '../Layout';

export const PageContainer = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const { maxMobileWidth, isMobile } = useLayoutContext();
  return (
    <Container sx={{ maxWidth: isMobile ? maxMobileWidth : '100%' }}>
      {children}
    </Container>
  );
};
