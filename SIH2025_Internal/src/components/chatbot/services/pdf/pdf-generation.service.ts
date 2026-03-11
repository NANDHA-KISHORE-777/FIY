
// PDF Generation Service for INGRES Chatbot
import html2canvas from 'html2canvas';

export interface CapturedChart {
  name: string;
  dataUrl: string;
  width: number;
  height: number;
}

export interface ReportData {
  query: string;
  timestamp: string;
  data: any[];
  summary?: string;
  userPrompt?: string;
}

export interface ReportRequest {
  title: string;
  description: string;
  query: string;
  data: any[];
  summary?: string;
  userPrompt?: string;
}

export class PdfGenerationService {
  private static instance: PdfGenerationService;
  private readonly API_BASE_URL = 'http://localhost:8080/api/reports';

  static getInstance(): PdfGenerationService {
    if (!this.instance) {
      this.instance = new PdfGenerationService();
    }
    return this.instance;
  }

  /**
   * Capture analytics components as images
   */
  async captureAnalyticsComponents(): Promise<CapturedChart[]> {
    const capturedCharts: CapturedChart[] = [];

    try {
      // Wait for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('🔍 Starting chart capture process...');

      // Find all chart containers in the DOM
      const chartSelectors = [
        '[data-chart-component]',
        '.apexcharts-canvas',
        '.recharts-wrapper'
      ];

      const processedElements = new Set<HTMLElement>();

      for (const selector of chartSelectors) {
        const elements = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
        console.log(`🔍 Found ${elements.length} elements for selector: ${selector}`);
        
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          
          // Skip if already processed
          if (processedElements.has(element)) continue;
          
          try {
            // Get the appropriate container
            let container: HTMLElement;
            
            if (element.hasAttribute('data-chart-component')) {
              // This is already a chart container
              container = element;
            } else if (element.classList.contains('apexcharts-canvas') || element.classList.contains('recharts-wrapper')) {
              // Find the parent card or container
              container = element.closest('.MuiCard-root') as HTMLElement || 
                         element.closest('[class*="Card"]') as HTMLElement ||
                         element.closest('[class*="analytics"]') as HTMLElement ||
                         element.closest('[data-chart-component]') as HTMLElement ||
                         element.parentElement as HTMLElement ||
                         element;
            } else {
              container = element;
            }

            if (container && !processedElements.has(container)) {
              processedElements.add(container);

              // Ensure container is visible
              if (container.offsetWidth === 0 || container.offsetHeight === 0) {
                console.log(`⚠️ Skipping invisible container for ${selector}`);
                continue;
              }

              console.log(`📸 Capturing container with dimensions: ${container.offsetWidth}x${container.offsetHeight}`);

              const canvas = await html2canvas(container, {
                backgroundColor: '#ffffff',
                logging: false,
                useCORS: true,
                allowTaint: true,
                height: container.scrollHeight,
                width: container.scrollWidth,
                scrollX: 0,
                scrollY: 0,
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight
              } as any);

              const dataUrl = canvas.toDataURL('image/png', 0.9);
              
              // Get chart title if available
              const titleElement = container.querySelector('h6, h5, h4, .MuiCardHeader-title, .MuiTypography-h6') ||
                                   container.querySelector('[class*="title"], [class*="Title"]');
              const chartName = titleElement?.textContent?.trim() || `Chart_${capturedCharts.length + 1}`;

              capturedCharts.push({
                name: chartName,
                dataUrl,
                width: canvas.width,
                height: canvas.height,
              });

              console.log(`✅ Captured chart: ${chartName} (${canvas.width}x${canvas.height})`);
            }
          } catch (error) {
            console.warn(`Failed to capture chart ${i + 1}:`, error);
          }
        }
      }

      console.log(`📊 Total charts captured: ${capturedCharts.length}`);
      
      // If no charts were captured, try to capture any visible analytics components
      if (capturedCharts.length === 0) {
        console.log('🔄 No charts captured, trying alternative approach...');
        await this.fallbackCaptureMethod(capturedCharts);
      }
      
      return capturedCharts;
    } catch (error) {
      console.error('❌ Error in captureAnalyticsComponents:', error);
      return capturedCharts;
    }
  }

  /**
   * Fallback method to capture analytics components
   */
  private async fallbackCaptureMethod(capturedCharts: CapturedChart[]): Promise<void> {
    try {
      // Try to find any MUI Cards that might contain charts
      const cards = document.querySelectorAll('.MuiCard-root');
      console.log(`🔍 Found ${cards.length} MUI Cards as fallback`);

      for (let i = 0; i < Math.min(cards.length, 6); i++) { // Limit to first 6 cards
        const card = cards[i] as HTMLElement;
        
        // Check if card contains chart-like content
        const hasChart = card.querySelector('.apexcharts-canvas, .recharts-wrapper, svg[class*="chart"]');
        if (hasChart && card.offsetWidth > 0 && card.offsetHeight > 0) {
          try {
            const canvas = await html2canvas(card, {
              backgroundColor: '#ffffff',
              logging: false,
              useCORS: true,
              allowTaint: true
            } as any);

            const dataUrl = canvas.toDataURL('image/png', 0.9);
            const titleElement = card.querySelector('h6, h5, h4, .MuiCardHeader-title');
            const chartName = titleElement?.textContent?.trim() || `Analytics_${i + 1}`;

            capturedCharts.push({
              name: chartName,
              dataUrl,
              width: canvas.width,
              height: canvas.height,
            });

            console.log(`✅ Fallback captured: ${chartName}`);
          } catch (error) {
            console.warn(`Failed to capture card ${i + 1}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('❌ Fallback capture method failed:', error);
    }
  }

  /**
   * Convert data URL to File object
   */
  private dataURLToFile(dataURL: string, filename: string): File {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
  }

  /**
   * Generate PDF report by sending data and images to backend
   */
  async generatePdfReport(reportData: ReportData): Promise<Blob> {
    try {
      // Capture analytics components
      const capturedCharts = await this.captureAnalyticsComponents();
      
      // Create FormData for multipart request
      const formData = new FormData();

      // Add report request data
      const reportRequest: ReportRequest = {
        title: `INGRES Groundwater Analysis Report`,
        description: reportData.userPrompt || reportData.query,
        query: reportData.query,
        data: reportData.data,
        summary: reportData.summary,
        userPrompt: reportData.userPrompt,
      };

      // Add report request data as JSON blob
      formData.append('reportRequest', new Blob([JSON.stringify(reportRequest)], {
        type: 'application/json'
      }), 'reportRequest.json');

      // Add captured chart images
      capturedCharts.forEach((chart, index) => {
        const filename = `chart_${index + 1}_${chart.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
        const file = this.dataURLToFile(chart.dataUrl, filename);
        formData.append('images', file);
      });

      // Add empty charts array if no images captured
      if (capturedCharts.length === 0) {
        const emptyFile = new File([''], 'empty.txt', { type: 'text/plain' });
        formData.append('images', emptyFile);
      }

      // Add empty charts array (as per your backend interface)
      const emptyChartsFile = new File([''], 'charts.txt', { type: 'text/plain' });
      formData.append('charts', emptyChartsFile);

      // Make request to backend
      const response = await fetch(`${this.API_BASE_URL}/generate`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error generating PDF report:', error);
      throw error;
    }
  }

  /**
   * Download PDF file
   */
  downloadPdf(pdfBlob: Blob, filename: string = 'ingres_report.pdf'): void {
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Main method to generate and download PDF report
   */
  async generateAndDownloadReport(
    data: any[], 
    query: string, 
    summary?: string,
    userPrompt?: string
  ): Promise<void> {
    try {
      const reportData: ReportData = {
        query,
        timestamp: new Date().toISOString(),
        data,
        summary,
        userPrompt,
      };

      const pdfBlob = await this.generatePdfReport(reportData);
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `INGRES_Report_${timestamp}.pdf`;
      
      this.downloadPdf(pdfBlob, filename);
    } catch (error) {
      console.error('Failed to generate and download PDF report:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const pdfGenerationService = PdfGenerationService.getInstance();
