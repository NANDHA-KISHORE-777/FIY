import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import type { Message } from '../types';

// ----------------------------------------------------------------------

type ChatMessageProps = {
  message: Message;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const theme = useTheme();
  const isBot = message.sender === 'bot';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isBot ? 'flex-start' : 'flex-end',
        mb: 2,
        opacity: 0,
        animation: 'fadeIn 0.5s forwards',
        '@keyframes fadeIn': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Avatar
        sx={{
          bgcolor: isBot ? 'primary.main' : 'secondary.main',
          mr: isBot ? 1 : 0,
          ml: isBot ? 0 : 1,
        }}
      >
        <Iconify icon={isBot ? 'solar:settings-bold-duotone' : 'solar:pen-bold'} />
      </Avatar>
      <Box
        sx={{
          p: 1.5,
          maxWidth: '80%',
          borderRadius: 1,
          bgcolor: isBot ? theme.vars.palette.background.neutral : theme.vars.palette.primary.main,
          color: isBot ? theme.vars.palette.text.primary : theme.vars.palette.common.white,
        }}
      >
        <Typography variant="body2">{message.text}</Typography>
      </Box>
    </Box>
  );
}
