import { useState, useEffect } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
  Card,
  CardContent,
  IconButton,
  Stack,
  CardHeader,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useLayoutContext } from '../Layout';

type CodeBlock = {
  snippet: string;
  description: string;
};

export const CodeCard = ({
  blocks,
  updatePhase,
}: {
  blocks: CodeBlock[];
  updatePhase: number;
}) => {
  const { isMobile, maxMobileWidth } = useLayoutContext();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (updatePhase < 0 || updatePhase >= blocks.length) return;
    setPhase(updatePhase);
  }, [updatePhase, blocks.length]);

  const handleForward = () => {
    if (phase === blocks.length - 1) return;
    setPhase(phase + 1);
  };

  const handleBackward = () => {
    if (phase === 0) return;
    setPhase(phase - 1);
  };

  const block = blocks[phase];
  const disableForward = phase === blocks.length - 1;
  const disableBackward = phase === 0;

  return (
    <Card>
      <CardHeader title="Code Walkthrough" subheader={block.description} />
      <CardContent>
        <Stack direction="row" spacing={2}>
          <IconButton
            aria-label="delete"
            onClick={handleBackward}
            disabled={disableBackward}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={handleForward}
            disabled={disableForward}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Stack>
        <div
          style={{
            overflowX: 'scroll',
            maxWidth: isMobile ? maxMobileWidth : '600',
          }}
        >
          <SyntaxHighlighter
            language="javascript"
            style={dracula}
            showLineNumbers
          >
            {block.snippet}
          </SyntaxHighlighter>
        </div>
      </CardContent>
    </Card>
  );
};
