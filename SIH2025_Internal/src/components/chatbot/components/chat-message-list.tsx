
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { keyframes } from '@mui/material/styles';
import { Message } from '../types';
import DownloadExcelButton from './download-excel-button';
import DownloadPdfButton from './download-pdf-button';

const slideInLeft = keyframes`
  from { opacity: 0, transform: 'translateX(-10px)' }
  to { opacity: 1, transform: 'translateX(0)' }
`;

const slideInRight = keyframes`
  from { opacity: 0, transform: 'translateX(10px)' }
  to { opacity: 1, transform: 'translateX(0)' }
`;

type ChatMessageListProps = {
  messages: Message[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
};

export function ChatMessageList({
  messages,
  isTyping,
  messagesEndRef,
}: ChatMessageListProps) {
  return (
    <Box sx={{
      flex: 1,
      overflowY: 'auto',
      p: 3,
      bgcolor: '#f9f9f9',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    }}>

      {messages.map((msg) => (
        <Box key={msg.id}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: msg.reportData ? 1 : 2.5,
              animation: `${msg.sender === 'user' ? slideInRight : slideInLeft} 0.4s ease-out`,
            }}
          >
            {msg.sender === 'bot' && (
              <Avatar src="/src/components/assets/robot.png" sx={{ width: 36, height: 36, mr: 1.5 }} />
            )}
            <Box
              sx={{
                maxWidth: '80%',
                bgcolor: msg.sender === 'user' ? '#007bff' : '#ffffff',
                color: msg.sender === 'user' ? '#ffffff' : '#333333',
                p: '10px 14px',
                borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                overflow: 'hidden',
              }}
            >
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.text}</Typography>
            </Box>
            {msg.sender === 'user' && (
              <Avatar src="/src/components/assets/people.png" sx={{ width: 36, height: 36, ml: 1.5 }} />
            )}
          </Box>

          {msg.sender === 'bot' && (msg.pdfUrl || (msg.reportData && msg.reportData.length > 0)) && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', ml: '52px', mb: 2.5 }}>
              {msg.pdfUrl && msg.reportContext && (
                <DownloadPdfButton 
                  pdfUrl={msg.pdfUrl}
                  query={msg.reportContext.query} 
                  summary={msg.reportContext.summary} 
                  userPrompt={msg.reportContext.userPrompt}
                  sessionId={msg.reportContext.sessionId}
                />
              )}
              {msg.reportData && msg.reportData.length > 0 && (
                <DownloadExcelButton data={msg.reportData} />
              )}
            </Box>
          )}
        </Box>
      ))}

      {isTyping && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, animation: `${slideInLeft} 0.4s ease-out` }}>
          <Avatar src="/src/components/assets/robot.png" sx={{ width: 36, height: 36, mr: 1.5 }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Assistant is typing...
          </Typography>
        </Box>
      )}

      <div ref={messagesEndRef} />
    </Box>
  );
}

