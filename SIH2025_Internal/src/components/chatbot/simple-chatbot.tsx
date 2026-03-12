import { useRef, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import GavelIcon from '@mui/icons-material/Gavel';
import ChatIcon from '@mui/icons-material/Chat';
import { Grow, CircularProgress, Chip } from '@mui/material';
import axios from 'axios';

// ----------------------------------------------------------------------




type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  ipcData?: {
    ipc_section: string;
    description: string;
    similarity_score: number;
  };
};

type ChatMode = 'ipc' | 'general';

type ChatbotProps = {
  open: boolean;
  onClose: () => void;
};

const BACKEND_URL = 'http://localhost:5000';
const OPENROUTER_API_KEY = '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';

export function SimpleChatbot({ open, onClose }: ChatbotProps) {
// --- Mode and separate message histories ---
const [mode, setMode] = useState<ChatMode>('ipc');
const [ipcMessages, setIpcMessages] = useState<Message[]>([]);
const [generalMessages, setGeneralMessages] = useState<Message[]>([]);

// Compute messages to render based on current mode
const messages = mode === 'ipc' ? ipcMessages : generalMessages;

// --- FIR and input states ---
const [waitingForFIRDetails, setWaitingForFIRDetails] = useState(false);
const [complaintTextFIR, setComplaintTextFIR] = useState("");
const [bnsSection, setBnsSection] = useState("");
// const [firDrafts, setFIRDrafts] = useState<{ [complaint: string]: string }>({});
// Store FIR drafts keyed by complaint text
const [firDrafts, setFIRDrafts] = useState<{ [complaint: string]: string }>({});
const [firDraftText, setFIRDraftText] = useState("");
const [inputText, setInputText] = useState('');
const [isProcessing, setIsProcessing] = useState(false);

// --- Speech recognition ---
const [isListening, setIsListening] = useState(false);
const [recognition, setRecognition] = useState<any>(null);

// --- Ref for scrolling ---
const messagesEndRef = useRef<HTMLDivElement | null>(null);
  

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Add welcome message when chatbot opens
useEffect(() => {
  if (!open) return;

  // Only add a welcome message if the current mode has no messages
  if (mode === 'ipc' && ipcMessages.length === 0) {
    const welcomeMessage: Message = {
      id: 'welcome',
      text: 'Welcome to YURUS! I can help you find relevant BNS sections for your complaints or answer general questions. Describe your complaint to get started.',
      sender: 'bot',
      timestamp: new Date(),
    };
    setIpcMessages([welcomeMessage]);
  } else if (mode === 'general' && generalMessages.length === 0) {
    const welcomeMessage: Message = {
      id: 'welcome',
      text: 'Welcome to YURUS General Chat! Ask me anything about legal matters.',
      sender: 'bot',
      timestamp: new Date(),
    };
    setGeneralMessages([welcomeMessage]);
  }
}, [open, mode]);

const handleModeChange = (event: React.MouseEvent<HTMLElement>, newMode: ChatMode | null) => {
  if (!newMode || newMode === mode) return;

  setMode(newMode);

  const modeMessage: Message = {
    id: `mode-${Date.now()}`,
    text:
      newMode === 'ipc'
        ? "BNS Finder mode activated. Describe your complaint and I'll find the relevant BNS section."
        : "General chat mode activated. Ask me anything about legal matters!",
    sender: 'bot',
    timestamp: new Date(),
  };

  if (newMode === 'ipc') {
    // Only add if this mode has no messages yet
    setIpcMessages(prev => (prev.length === 0 ? [modeMessage] : prev));
  } else {
    setGeneralMessages(prev => (prev.length === 0 ? [modeMessage] : prev));
  }
};
  const handleVoiceInput = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setInputText('');
      recognition.start();
      setIsListening(true);
    }
  };

  const handleIPCFinder = async (complaintText: string): Promise<{ text: string; ipcData?: any }> => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/ipc-finder`, {
        complaint: complaintText,
      });

      if (response.data.success) {
        const { ipc_section, message, similarity_score, description } = response.data;
        
        return {
          text: message,
          ipcData: {
            ipc_section,
            description,
            similarity_score,
          }
        };
      } else {
        return { text: 'Failed to find IPC section. Please try again.' };
      }
    } catch (error) {
      console.error('IPC Finder error:', error);
      return { text: 'Error connecting to IPC finder service. Please make sure the backend is running.' };
    }
  };

  // Clean and format AI response (keep full content, just remove markdown)
  const formatAIResponse = (text: string): string => {
    // Remove markdown bold symbols
    let formatted = text.replace(/\*\*/g, '');
    
    // Remove other markdown symbols
    formatted = formatted.replace(/\*/g, '');
    formatted = formatted.replace(/#{1,6}\s/g, '');
    formatted = formatted.replace(/`/g, '');
    
    // Clean up extra whitespace but keep all content
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    formatted = formatted.trim();
    
    return formatted;
  };

  const handleGeneralChat = async (messageText: string): Promise<string> => {
    if (!OPENROUTER_API_KEY) {
      return 'OpenRouter API key is not configured. Please set the OPENROUTER_API_KEY in the code.';
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/general-chat`, {
        message: messageText,
      });

      if (response.data.success) {
        // Format the response to remove markdown and limit length
        return formatAIResponse(response.data.message);
      } else {
        return 'Failed to get response. Please try again.';
      }
    } catch (error) {
      console.error('General chat error:', error);
      return 'Error connecting to chat service. Please make sure the backend is running and OpenRouter API is configured.';
    }
  };
// -------------------------------
// FIR Draft Generator
// -------------------------------
const generateFIRDraft = (details: string, complaint: string, section: string) => {
  // Split the user input by commas and trim spaces
  const parts = details.split(',').map(p => p.trim());

  // Map to the proper fields safely
  const [name, address, dateOfIncident, timeOfIncident, location, policeStation] = parts;

  return `FIR DRAFT

To  
The Station House Officer
${policeStation || ''}

Date: ${dateOfIncident || ''}

Subject: Complaint regarding offence under ${section}

Respected Sir/Madam,

I hereby lodge a complaint regarding the following incident:

Incident Description:
${complaint}

Relevant Legal Section:
${section}

Complainant Details:
- Name: ${name || ''}
- Address: ${address || ''}
- Date of Incident: ${dateOfIncident || ''}
- Time of Incident: ${timeOfIncident || ''}
- Location of Incident: ${location || ''}
- Nearest Police Station: ${policeStation || ''}

I kindly request you to register this complaint and take necessary legal action.

Thanking you.

Yours faithfully,
${name || ''}
`;
};
const handleSend = async () => {
  const messageText = inputText.trim();
  if (!messageText || isProcessing) return;

  setIsProcessing(true);
  setInputText(''); // clear input immediately

  // 1️⃣ Add user message
  const userMessage: Message = {
    id: `user-${Date.now()}`,
    text: messageText,
    sender: 'user',
    timestamp: new Date(),
  };
  if (mode === 'ipc') setIpcMessages(prev => [...prev, userMessage]);
  else setGeneralMessages(prev => [...prev, userMessage]);

  // 2️⃣ FIR Draft Handling
  // Check if FIR draft already exists for this complaint
  if (firDrafts[messageText]) {
    const botMsg: Message = {
      id: `bot-${Date.now()}`,
      text: firDrafts[messageText], // use existing draft
      sender: 'bot',
      timestamp: new Date(),
    };
    if (mode === 'ipc') setIpcMessages(prev => [...prev, botMsg]);
    else setGeneralMessages(prev => [...prev, botMsg]);

    setIsProcessing(false);
    return; // exit early, no need to ask for details again
  }

  if (waitingForFIRDetails) {
    // User has provided the comma-separated details for a new FIR
    const parts = messageText.split(',').map(p => p.trim());
    const [name, address, dateOfIncident, timeOfIncident, location, policeStation] = parts;

    const firMessageText = `
FIR DRAFT

To
The Station House Officer
${policeStation || ''}

Date: ${dateOfIncident || ''}

Subject: Complaint regarding offence under ${bnsSection}

Respected Sir/Madam,

I hereby lodge a complaint regarding the following incident:

Incident Description:
${complaintTextFIR}

Relevant Legal Section:
${bnsSection}

Complainant Details:
- Name: ${name || ''}
- Address: ${address || ''}
- Date of Incident: ${dateOfIncident || ''}
- Time of Incident: ${timeOfIncident || ''}
- Location of Incident: ${location || ''}

I kindly request you to register this complaint and take necessary legal action.

Thanking you.

Yours faithfully,
${name || ''}
`;

    // Save FIR draft keyed by the original complaint
    setFIRDrafts(prev => ({ ...prev, [complaintTextFIR]: firMessageText }));

    const botMsg: Message = {
      id: `bot-${Date.now()}`,
      text: firMessageText,
      sender: 'bot',
      timestamp: new Date(),
    };
    if (mode === 'ipc') setIpcMessages(prev => [...prev, botMsg]);
    else setGeneralMessages(prev => [...prev, botMsg]);

    setWaitingForFIRDetails(false);
    setIsProcessing(false);
    return;
  }

  // 3️⃣ Bot response based on mode
  let botMsg: Message;
  if (mode === 'ipc') {
    const ipcResponse = await handleIPCFinder(messageText);
    const section = ipcResponse.ipcData?.ipc_section || 'Unknown Section';

    setComplaintTextFIR(messageText); // store complaint for FIR
    setBnsSection(section);

    botMsg = {
      id: `bot-${Date.now()}`,
      text: ipcResponse.text + `

To generate an FIR draft please provide the following details (comma-separated):

Full Name:
Address:
Date of Incident:
Time of Incident:
Location:
`,
      sender: 'bot',
      timestamp: new Date(),
      ipcData: ipcResponse.ipcData,
    };

    setWaitingForFIRDetails(true);
  } else {
    const generalReply = await handleGeneralChat(messageText);
    botMsg = {
      id: `bot-${Date.now()}`,
      text: generalReply,
      sender: 'bot',
      timestamp: new Date(),
    };
  }

  // 4️⃣ Save bot message
  if (mode === 'ipc') setIpcMessages(prev => [...prev, botMsg]);
  else setGeneralMessages(prev => [...prev, botMsg]);

  setIsProcessing(false);
};
//   const handleSend = async () => {
//     const messageText = inputText.trim();
//     if (!messageText || isProcessing) return;

// if (waitingForFIRDetails) {
//   // This block will run **only if the bot is waiting for FIR details**
// }



//     setIsProcessing(true);
//     setInputText('');

//     // Add user message
//     const userMessage: Message = {
//       id: `user-${Date.now()}`,
//       text: messageText,
//       sender: 'user',
//       timestamp: new Date(),
//     };
//     setMessages(prev => [...prev, userMessage]);

//     // Generate bot response based on mode
//     let botMessage: Message;
//     if (mode === 'ipc') {
//       const ipcResponse = await handleIPCFinder(messageText);
//       botMessage = {
//         id: `bot-${Date.now()}`,
//         text: ipcResponse.text,
//         sender: 'bot',
//         timestamp: new Date(),
//         ipcData: ipcResponse.ipcData,
//       };
//     } else {
//       const generalResponse = await handleGeneralChat(messageText);
//       botMessage = {
//         id: `bot-${Date.now()}`,
//         text: generalResponse,
//         sender: 'bot',
//         timestamp: new Date(),
//       };
//     }

//     setMessages(prev => [...prev, botMessage]);
//     setIsProcessing(false);
//   };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) return null;

  return (
    <>
      {open && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1999,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
          onClick={onClose}
        />
      )}
      {open && (
        <Box
          sx={{
            position: 'fixed',
            bottom: { xs: 20, sm: 90 },
            right: { xs: 20, sm: 90 },
            left: { xs: 20, sm: 'auto' },
            zIndex: 2000,
          }}
        >
          <Grow in={open} timeout={700} style={{ transformOrigin: 'bottom right' }}>
            <Paper
              sx={{
                width: { xs: 'calc(100vw - 40px)', sm: 420 },
                height: { xs: 'calc(100vh - 120px)', sm: 650 },
                maxWidth: { xs: 'none', sm: 420 },
                maxHeight: { xs: 'calc(100vh - 120px)', sm: '85vh' },
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                border: '1px solid #e0e0e0',
                bgcolor: '#ffffff',
                overflow: 'hidden',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <Box
                sx={{
                  p: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderBottom: '1px solid #e0e0e0',
                }}
              >
                <Box
                  component="img"
                  src="/src/components/assets/robot.png"
                  sx={{
                    width: 45,
                    height: 45,
                    borderRadius: '50%',
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    bgcolor: '#ffffff',
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>
                    YURUS Assistant
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    BNS Section Mapper
                  </Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ color: '#ffffff' }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Mode Selector */}
              <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0', bgcolor: '#fafafa' }}>
                <ToggleButtonGroup
                  value={mode}
                  exclusive
                  onChange={handleModeChange}
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiToggleButton-root': {
                      textTransform: 'none',
                      fontWeight: 500,
                    },
                  }}
                >
                  <ToggleButton value="ipc" aria-label="IPC Finder">
                    <GavelIcon sx={{ mr: 1, fontSize: 18 }} />
                    BNS Finder
                  </ToggleButton>
                  <ToggleButton value="general" aria-label="General Chat">
                    <ChatIcon sx={{ mr: 1, fontSize: 18 }} />
                    General
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Messages */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  bgcolor: '#f8f9fa',
                }}
              >
                {messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '75%',
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: message.sender === 'user' ? '#667eea' : '#ffffff',
                        color: message.sender === 'user' ? '#ffffff' : '#2c3e50',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {message.text}
                      </Typography>
                      {message.ipcData && (
                        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #e0e0e0' }}>
                          <Chip
                            label={`BNS Section: ${message.ipcData.ipc_section}`}
                            size="small"
                            color="primary"
                            sx={{ mb: 1, fontWeight: 600 }}
                          />
                          {message.ipcData.description && (
                            <Typography variant="caption" display="block" sx={{ mt: 1, mb: 0.5, color: '#555' }}>
                              <strong>Description:</strong> {message.ipcData.description}
                            </Typography>
                          )}
                          <Typography variant="caption" display="block" sx={{ mt: 0.5, color: '#666' }}>
                            <strong>Confidence:</strong> {(message.ipcData.similarity_score * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      )}
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7 }}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                {isProcessing && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: '#ffffff',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      }}
                    >
                      <CircularProgress size={20} />
                    </Box>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* Input */}
              <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', bgcolor: '#ffffff' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={3}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      mode === 'ipc'
                        ? 'Describe your complaint...'
                        : 'Ask me anything...'
                    }
                    disabled={isProcessing}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                  <IconButton
                    onClick={handleVoiceInput}
                    color={isListening ? 'error' : 'default'}
                    disabled={isProcessing}
                  >
                    {isListening ? <MicOffIcon /> : <MicIcon />}
                  </IconButton>
                  <Button
                    variant="contained"
                    onClick={handleSend}
                    disabled={!inputText.trim() || isProcessing}
                    sx={{
                      minWidth: 'auto',
                      px: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    <SendIcon />
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grow>
        </Box>
      )}
    </>
  );
}
