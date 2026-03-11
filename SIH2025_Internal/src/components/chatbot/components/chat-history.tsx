
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatIcon from '@mui/icons-material/Chat';
import { ChatSession } from '../types';

type ChatHistoryProps = {
  onClose: () => void;
  onSelectChat: (chatId: string) => void;
  sessions: ChatSession[];
};

// Function to format date nicely
const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
}

export function ChatHistory({ onClose, onSelectChat, sessions }: ChatHistoryProps) {
  const sortedSessions = [...sessions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <IconButton onClick={onClose} sx={{ color: '#7f8c8d' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', flex: 1 }}>
          Chat History
        </Typography>
      </Box>

      {/* History List */}
      <List sx={{
        flex: 1,
        overflowY: 'auto',
        p: 1,
        scrollbarWidth: 'none',  
        '&::-webkit-scrollbar': {
          display: 'none', 
        },
      }}>
        {sortedSessions.map((session) => (
          <ListItem key={session.id} disablePadding>
            <ListItemButton onClick={() => onSelectChat(session.id)} sx={{ borderRadius: 1, mb: 0.5 }}>
              <ListItemAvatar>
                <Avatar>
                  <ChatIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={session.title}
                secondary={`Created: ${formatTimestamp(session.createdAt)}`}
                primaryTypographyProps={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                secondaryTypographyProps={{ fontSize: '0.8rem' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

