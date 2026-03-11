import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/reports';

export const reportApi = {
  async generateReport(formData: FormData, sessionId: string): Promise<string> {
    const response = await axios.post(`${API_BASE_URL}/generate?sessionId=${sessionId}`, formData, {});
    return response.data; // The URL of the report
  },
};
