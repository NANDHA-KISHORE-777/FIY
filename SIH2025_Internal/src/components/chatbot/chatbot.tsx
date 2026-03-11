import { useRef, useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';
import CreateIcon from '@mui/icons-material/Create';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import { Grow } from '@mui/material';

import type { Message as DisplayMessage, ChatSession, ChatMessage } from './types';
import { LanguageContext } from 'src/context/language-context';
import { useSpeechToText } from './hooks/use-speech-to-text';
import { translationService, aiQueryService, queryProcessor } from './services';
import { chatApi } from './services/chat-api';
import { ChatMessageList } from './components/chat-message-list';
import { ChatHistory } from './components/chat-history';
import { WelcomeScreen } from './components/welcome-screen';
import { ChatInput } from './components/chat-input';
import { executeQuery, getPopularQueries, type PopularQuery } from './services/query';
import html2canvas from 'html2canvas';
import { reportApi } from './services/report-api';

// ----------------------------------------------------------------------

type ChatbotProps = {
  open: boolean;
  onClose: () => void;
  anchorEl: null | HTMLElement;
};

// Helper to convert backend message to display message
const toDisplayMessage = (message: ChatMessage, sessionId?: string): DisplayMessage => {
  const pdfUrl =
    message.report?.url || (message.reportId ? `http://localhost:8080/api/reports/${message.reportId}` : undefined);
  const reportData = message.queryDetails?.queryOutput || message.reportData;
  const query = message.query || message.queryDetails?.query;

  return {
    id: message.id,
    text: message.content,
    sender: message.sender.toLowerCase() as 'user' | 'bot',
    timestamp: new Date(message.createdAt),
    pdfUrl,
    reportData,
    reportContext: query
      ? {
          query,
          userPrompt: '', // Not available from history
          summary: message.content,
          sessionId: sessionId || '',
        }
      : undefined,
  };
};


export function Chatbot({ open, onClose, anchorEl }: ChatbotProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const languageContext = useContext(LanguageContext);

  const [view, setView] = useState<'welcome' | 'chat' | 'history'>('welcome');
  const [previousView, setPreviousView] = useState<'welcome' | 'chat'>('welcome');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isChatLive, setIsChatLive] = useState(true);

  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false); // For disabling input

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [popularQueries, setPopularQueries] = useState<PopularQuery[]>([]);

  const { isListening, transcript, startListening, stopListening } = useSpeechToText({
    lang: languageContext?.language || 'en-US',
  });

  const getAudioUrl = async (text: string, lang: string, sessionId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/tts/generate?sessionId=${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang }),
      });
      if (!response.ok) throw new Error('Failed to fetch audio from backend');
      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Error fetching audio:', error);
      return null;
    }
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  useEffect(() => {
    if (isListening) {
      setInputText(transcript);
    }
  }, [transcript, isListening]);

  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const scrollY = window.scrollY;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
    return undefined;
  }, [open]);

  // Fetch initial data on component mount
  useEffect(() => {
    if (open) {
      chatApi.getAllSessions().then(setSessions).catch(console.error);
      getPopularQueries().then(setPopularQueries).catch(console.error);
    }
  }, [open]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const startNewChat = async () => {
    setIsProcessing(true);
    try {
      const session = await chatApi.startSession('New Conversation');
      setCurrentSession(session);

      const openingMessage = 'Welcome to the INGRES Chatbot! How can I help you today?';
      
      const currentLang = languageContext?.language || 'en-US';
      let translatedMessage = openingMessage;
      if (!currentLang.startsWith('en-')) {
        try {
          translatedMessage = await translationService.translateText(openingMessage, 'en-US', currentLang);
        } catch (error) {
          console.error('❌ Opening message translation error:', error);
        }
      }

      const botMessage = await chatApi.sendBotMessage(session.id, translatedMessage);

      setMessages([toDisplayMessage(botMessage)]);

      const audioUrl = await getAudioUrl(translatedMessage, currentLang, session.id);
      if (audioUrl) {
        playAudio(audioUrl);
      }
      
      setView('chat');
      setIsFlipped(false);
      setIsChatLive(true);

    } catch (error) {
      console.error('Failed to start new chat:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateBotResponse = async (userInput: string, sessionId: string): Promise<Omit<DisplayMessage, 'id' | 'timestamp'>> => {
    try {
      console.log('🤖 Processing user query with AI:', userInput);
      const aiResponse = await aiQueryService.generateQuery(userInput);

      if (!aiResponse.success) {
        console.error('AI Query Service failed:', aiResponse.error);
        await executeQuery("no response", sessionId, userInput);
        return { sender: 'bot', text: 'I had trouble understanding your query. Could you please rephrase it?' };
      }

      console.log('✅ AI Query Generated:', aiResponse);
      const processedResult = await queryProcessor.processQuery(aiResponse);

      if (!processedResult.success) {
        console.error('Query processing failed:', processedResult.message);
        await executeQuery("no response", sessionId, userInput);
        return { sender: 'bot', text: processedResult.message };
      }
      if (aiResponse.query.sql === "not a valid query\n") {
        await executeQuery("no response", sessionId, userInput);
        return { sender: 'bot', text: "Not a valid groundwater query." };
      }
      console.log('✅ Query Processed:', processedResult);

      if (aiResponse.query.sql) {
        const data = await executeQuery(aiResponse.query.sql, sessionId, userInput);
        // Ensure data is an array, even if executeQuery returns null
        const processedData = data || []; // Add this line

        if (processedData.length === 0) return { sender: 'bot', text: "Couldn't find any data" };

        const botResponseText = "Your query has been processed successfully! You can download the report.";
        return {
          sender: 'bot',
          text: botResponseText,
          reportData: processedData, // Use processedData here
          reportContext: {
            query: aiResponse.query.sql,
            userPrompt: userInput,
            summary: botResponseText,
            sessionId: sessionId,
          },
        };
      }

      await executeQuery("no response", sessionId, userInput);
      return { sender: 'bot', text: "Unable to process your query." };

    } catch (error) {
      console.error('❌ Error in generateBotResponse:', error);
      await executeQuery("no response", sessionId, userInput);
      return { sender: 'bot', text: 'I am having trouble connecting to my knowledge base. Please try again later.' };
    }
  };

  const handleSend = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText || !currentSession) return;

    setIsProcessing(true);
    setInputText('');

    const optimisticUserMessage: DisplayMessage = {
      id: `temp-user-${Date.now()}`,
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, optimisticUserMessage]);

    try {
      const sentUserMessage = await chatApi.sendUserMessage(currentSession.id, messageText);
      const botResponse = await generateBotResponse(messageText, currentSession.id);
      
      const currentLang = languageContext?.language || 'en-US';
      let translatedBotText = botResponse.text;
      if (!currentLang.startsWith('en-')) {
        try {
          translatedBotText = await translationService.translateText(botResponse.text, 'en-US', currentLang);
        } catch (error) {
          console.error('❌ Bot response translation error:', error);
        }
      }

      const sentBotMessage = await chatApi.sendBotMessage(currentSession.id, translatedBotText);

      // --- PDF Generation Logic ---
      let generatedPdfUrl: string | undefined;
      try {
        const chartElements = document.querySelectorAll('.apexcharts-canvas');
        console.log(chartElements)
        const chartPromises = Array.from(chartElements).map(el => 
          html2canvas(el as HTMLElement, {
              background: undefined, // Make background transparent
              useCORS: true 
          }).then(canvas => canvas.toDataURL('image/png'))
        );
        const chartImagesAsDataUrls = await Promise.all(chartPromises);

        const chartBlobs = await Promise.all(
          chartImagesAsDataUrls.map(async (dataUrl, index) => {
            const res = await fetch(dataUrl);
            const blob = await res.blob();
            return new File([blob], `chart-${index}.png`, { type: 'image/png' });
          })
        );
        
        const reportRequest = {
          title: botResponse.reportContext?.userPrompt || 'Generated Report',
          description: botResponse.reportContext?.summary || '',
          data: botResponse.reportData,
        };
        console.log('Report Request Payload:', reportRequest);

        const formData = new FormData();
        const reportRequestBlob = new Blob([JSON.stringify(reportRequest)], { type: 'application/json' });
        formData.append('reportRequest', reportRequestBlob);
        console.log(chartBlobs)
        chartBlobs.forEach((blob, index) => {
          formData.append('charts', blob, `chart-${index}.png`);
        });
        
        // Send empty images part to satisfy backend signature
        formData.append('images', new Blob([], { type: 'image/png' }), 'empty.png');
        console.log("aaa", formData)
        generatedPdfUrl = await reportApi.generateReport(formData, currentSession.id);
        console.log('PDF generated:', generatedPdfUrl);

      } catch (pdfError) {
        console.error('❌ Error during PDF generation:', pdfError);
        // Do not rethrow, allow chat to continue even if PDF generation fails
      }
      // --- End PDF Generation Logic ---

      setMessages(prev => {
        const newMessages = prev.filter(m => m.id !== optimisticUserMessage.id);
        newMessages.push(toDisplayMessage(sentUserMessage));
        newMessages.push({
          ...toDisplayMessage(sentBotMessage),
          reportData: botResponse.reportData,
          reportContext: botResponse.reportContext,
          pdfUrl: generatedPdfUrl, // Store the generated PDF URL
        });
        return newMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      });

      const audioUrl = await getAudioUrl(translatedBotText, currentLang, currentSession.id);
      if (audioUrl && isChatLive) {
        playAudio(audioUrl);
      }

    } catch (error) {
      console.error('Error in handleSend:', error);
      setMessages(prev => prev.filter(m => m.id !== optimisticUserMessage.id));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSession(null);
    setMessages([]);
    setView('welcome');
  };

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setView('welcome');
      setIsFlipped(false);
      setCurrentSession(null);
    }, 300);
  };

  const handleToggleHistory = () => {
    if (view !== 'history') {
      chatApi.getAllSessions().then(setSessions).catch(console.error);
      setPreviousView(view as 'welcome' | 'chat');
      setTimeout(() => {
        setView('history');
        setIsFlipped(true);
      }, 50);
    } else {
      setIsFlipped(false);
      setTimeout(() => {
        setView(previousView);
      }, 400);
    }
  };

  const handleSelectChat = async (sessionId: string) => {
    try {
      const conversation = await chatApi.getConversation(sessionId);
      const fullSession: ChatSession = {
        id: sessionId,
        title: sessions.find(s => s.id === sessionId)?.title || 'Chat',
        createdAt: sessions.find(s => s.id === sessionId)?.createdAt || new Date().toISOString(),
        messages: conversation,
      };
      setCurrentSession(fullSession);
      const displayMessages = conversation.map(msg => toDisplayMessage(msg, sessionId)).sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime());
      setMessages(displayMessages);
      setIsChatLive(false);
      setView('chat');
      setIsFlipped(false);
    } catch (error) {
      console.error('Failed to load selected chat:', error);
    }
  };


  const handleStartListening = () => {
    setInputText('');
    startListening();
  };

  const canStartNewChat = !currentSession || messages.length > 1;

  if (!open) return null;

  return (
    <>
      {open && (
        <Box
          sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1999, backgroundColor: 'transparent' }}
          onClick={handleClose}
        />
      )}
      {open && (
        <Box sx={{
          position: 'fixed',
          bottom: { xs: 20, sm: 90 },
          right: { xs: 20, sm: 90 },
          left: { xs: 20, sm: 'auto' },
          zIndex: 2000,
          perspective: '1000px'
        }}>
          <Grow in={open && !isClosing} timeout={isClosing ? 300 : 700} style={{ transformOrigin: 'bottom right' }}>
            <Box sx={{
              transform: open && !isClosing
                ? { xs: 'translate(0, 0)', sm: 'translate(-8px, -8px)' }
                : 'translate(0, 0)',
              transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
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
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.8s',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  overflow: view === 'history' ? 'visible' : 'hidden',
                  position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Front side of the card (Welcome or Chat) */}
                <Box sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  bgcolor: '#ffffff'
                }}>
                  <Box
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                      borderBottom: '1px solid #e0e0e0',
                    }}
                  >
                    <Box component="img" src="/src/components/assets/robot.png" sx={{
                      width: { xs: 35, sm: 45 },
                      height: { xs: 35, sm: 45 },
                      borderRadius: '50%',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      bgcolor: '#ffffff'
                    }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>INGRES AI Assistant</Typography>
                      <Typography variant="caption" sx={{ color: '#7f8c8d' }}>Water Management Expert</Typography>
                    </Box>
                    <IconButton onClick={handleToggleHistory} sx={{ color: '#7f8c8d' }}><HistoryIcon fontSize="small" /></IconButton>
                    <IconButton onClick={handleNewChat} sx={{ color: '#7f8c8d' }} disabled={!canStartNewChat}><CreateIcon fontSize="small" /></IconButton>
                    <IconButton onClick={handleClose} sx={{ color: '#7f8c8d' }}><CloseIcon fontSize="small" /></IconButton>
                  </Box>

                  {view === 'welcome' ? (
                    <WelcomeScreen onStartNewChat={startNewChat} />
                  ) : (
                    <>
                      <Box sx={{
                        p: { xs: 1.5, sm: 2 },
                        borderBottom: '1px solid #f0f0f0',
                        bgcolor: '#fafafa',
                        overflowX: 'auto',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': {
                          display: 'none',
                        },
                        flexShrink: 0,
                      }}>
                        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5, width: 'max-content', minWidth: '100%' }}>
                          {popularQueries.map((query, index) => (
                            <Chip
                              key={index}
                              label={query.userPrompt}
                              size="small"
                              icon={<SearchIcon fontSize="small" />}
                              onClick={() => handleSend(query.userPrompt)}
                              disabled={isProcessing}
                              sx={{ flexShrink: 0, minWidth: 'fit-content', bgcolor: '#ffffff', color: '#5a6c7d', border: '1px solid #e0e0e0', '&:hover': { bgcolor: '#f8f9fa', borderColor: '#b0bec5' } }}
                            />
                          ))}
                        </Stack>
                      </Box>
                      <ChatMessageList
                        messages={messages}
                        isTyping={isProcessing}
                        messagesEndRef={messagesEndRef}
                      />
                      <ChatInput
                        inputText={inputText}
                        setInputText={setInputText}
                        isListening={isListening}
                        isTyping={isProcessing}
                        startListening={handleStartListening}
                        stopListening={stopListening}
                        handleSend={handleSend}
                        handleKeyPress={handleKeyPress}
                        transcript={transcript}
                        disabled={isProcessing}
                      />
                    </>
                  )}
                </Box>

                {/* Back side of the card (History) */}
                <Box sx={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <ChatHistory sessions={sessions} onClose={handleToggleHistory} onSelectChat={handleSelectChat} />
                </Box>
              </Paper>
            </Box>
          </Grow>
        </Box>
      )}
    </>
  );
}
      