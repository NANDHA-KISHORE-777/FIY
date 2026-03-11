
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { keyframes } from '@mui/material/styles';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

type WelcomeScreenProps = {
  onStartNewChat: () => void;
};

export function WelcomeScreen({ onStartNewChat }: WelcomeScreenProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        p: 3,
        animation: `${fadeIn} 0.8s ease-out`,
      }}
    >
      <Box
        component="img"
        src="/src/components/assets/robot.png"
        sx={{
          width: 80,
          height: 80,
          mb: 2,
        }}
      />
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        Welcome to INGRES Chatbot
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Your AI assistant for water management. Start a new chat to ask questions, get reports, and analyze data.
      </Typography>
      <Button variant="contained" onClick={onStartNewChat}>
        Start New Chat
      </Button>
    </Box>
  );
}
