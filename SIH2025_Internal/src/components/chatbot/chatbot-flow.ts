import type { ChatFlow } from './types';

export const chatbotFlow: ChatFlow = {
  start: {
    text: 'Welcome to the INGRES Chatbot! How can I help you today?',
    options: [
      { text: 'What is INGRES?', next: 'ingres_definition' },
      { text: 'Latest assessment results', next: 'latest_results' },
      { text: 'Contact support', next: 'contact_support' },
    ],
  },
  ingres_definition: {
    text: 'INGRES (India Ground Water Resource Estimation System) is a GIS-based web application for assessing dynamic groundwater resources in India.',
    next: 'start',
  },
  latest_results: {
    text: 'The latest assessment results for 2023 are now available. Would you like to see a summary?',
    options: [
      { text: 'Yes, please', next: 'results_summary' },
      { text: 'No, thank you', next: 'start' },
    ],
  },
  results_summary: {
    text: 'The 2023 assessment shows that 70% of units are in the Safe category, 15% are Semi-Critical, 10% are Critical, and 5% are Over-Exploited.',
    next: 'start',
  },
  contact_support: {
    text: 'You can contact our support team at support@ingres.gov.in.',
    next: 'start',
  },
};
