import { useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SendIcon from '@mui/icons-material/Send';
import { alpha } from '@mui/material/styles';

type Props = {
  inputText: string;
  setInputText: (text: string) => void;
  isListening: boolean;
  isTyping: boolean;
  startListening: () => void;
  stopListening: () => void;
  handleSend: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  transcript: string;
  disabled?: boolean;
};

export function ChatInput({ inputText,
  setInputText,
  isListening,
  isTyping,
  startListening,
  stopListening,
  handleSend,
  handleKeyPress,
  transcript,
  disabled,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isScrolledToEndRef = useRef(true);

  const handleScroll = () => {
    if (inputRef.current) {
      const input = inputRef.current;
      isScrolledToEndRef.current = input.scrollLeft + input.clientWidth >= input.scrollWidth - 10;
    }
  };

  useEffect(() => {
    if (isListening && inputRef.current && isScrolledToEndRef.current) {
      inputRef.current.scrollLeft = inputRef.current.scrollWidth;
    }
  }, [transcript, isListening]);

  return (
    <Box sx={{ p: { xs: 0.5, sm: 1 }, borderTop: '1px solid #e0e0e0', bgcolor: '#ffffff' }}>
      <TextField
        fullWidth
        maxRows={1}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        disabled={disabled || isTyping}
        inputRef={inputRef}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1.5,
            bgcolor: '#f8f9fa',
            border: '1px solid #e0e0e0',
            minHeight: { xs: '45px', sm: '55px' },
            alignItems: 'center',
            '& .MuiOutlinedInput-input': {
              padding: '6px 10px',
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
              overflowX: 'auto', // Enable horizontal scrolling
              overflowY: 'hidden', // Hide vertical scroll
              // Hide scrollbar but keep functionality
              scrollbarWidth: 'none',  // Firefox
              '&::-webkit-scrollbar': {
                display: 'none', // Chrome, Safari, Edge
              },
            },
            '&:hover': {
              borderColor: '#b0bec5',
            },
            '&.Mui-focused': {
              borderColor: '#667eea',
              boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.1)',
            },
          },
        }}
        InputProps={{
          onScroll: handleScroll,
          endAdornment: (
            <InputAdornment position="end">
              <Stack direction="row" spacing={0.5}>
                <IconButton
                  onClick={() => {
                    if (isListening) {
                      stopListening();
                      setInputText(transcript);
                    } else {
                      startListening();
                    }
                  }}
                  disabled={disabled || isTyping}
                  sx={{
                    color: isListening ? '#e74c3c' : '#7f8c8d',
                    '&:hover': { bgcolor: isListening ? alpha('#e74c3c', 0.08) : alpha('#7f8c8d', 0.08) },
                    '&:disabled': { color: '#bdc3c7' },
                  }}
                >
                  {isListening ? <MicOffIcon fontSize="small" /> : <MicIcon fontSize="small" />}
                </IconButton>
                <IconButton
                  onClick={() => handleSend()}
                  disabled={!inputText.trim() || isTyping || disabled}
                  sx={{
                    color: '#667eea',
                    '&:hover': { bgcolor: alpha('#667eea', 0.08) },
                    '&:disabled': { color: '#bdc3c7' },
                  }}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </Stack>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
