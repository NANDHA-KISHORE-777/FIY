
import axios from 'axios';

export interface PopularQuery {
  userPrompt: string;
}

export const executeQuery = async (query: string, sessionId: string, userInput: string) => {
  const payload = {
    sqlQuery: query,
    userPrompt: userInput,
  };
  const response = await axios.post(`http://localhost:8080/api/query/execute?sessionId=${sessionId}`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const getPopularQueries = async (): Promise<PopularQuery[]> => {
  const response = await axios.get('http://localhost:8080/api/query/popular');
  return response.data;
};
