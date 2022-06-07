import { Container } from '@mui/material';
import { useLayoutContext } from '../Layout';

export const PageContainer = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const { maxMobileWidth, isMobile } = useLayoutContext();
  const style: any = {};
  if (isMobile) style.maxWidth = maxMobileWidth;
  return (
    <Container style={style} maxWidth="xl">
      {children}
    </Container>
  );
};
