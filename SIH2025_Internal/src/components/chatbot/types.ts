export type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  originalText?: string; // For storing English version for AI processing
  component?: React.ReactNode;
  reportData?: any[] | null;
  reportContext?: { // For PDF button props
    query: string;
    userPrompt: string;
    summary: string;
    sessionId: string;
  };
  pdfUrl?: string;
};

export type ChatFlow = {
  [key: string]: {
    text: string | ((params: any) => string);
    options?: {
      text: string;
      next: string;
    }[];
    action?: (params: any) => Promise<any>;
    next?: string;
  };
};

// From backend
export type ChatMessage = {
  id: string; // UUID
  sender: 'USER' | 'BOT';
  content: string;
  query?: string;
  reportId?: string;
  createdAt: string; // ISO 8601 date string
  report?: {
    id: string;
    url: string;
  };
  reportData?: any[];
  queryDetails?: {
    query: string | null;
    queryOutput: any[] | null;
  };
};

export type ChatSession = {
  id: string; // UUID
  title: string;
  createdAt: string; // ISO 8601 date string
  messages: ChatMessage[];
};
