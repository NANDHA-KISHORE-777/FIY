import Button from '@mui/material/Button';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

type DownloadPdfButtonProps = {
  query: string; // Keep for consistency, though not used for direct download
  summary: string; // Keep for consistency
  userPrompt: string; // Keep for consistency
  sessionId: string; // Keep for consistency
  pdfUrl?: string; // New prop for the generated PDF URL
};

export default function DownloadPdfButton({ pdfUrl }: DownloadPdfButtonProps) {
  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      alert('PDF report not available yet.');
    }
  };

  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<PictureAsPdfIcon />}
      onClick={handleDownload}
      disabled={!pdfUrl} // Disable if no PDF URL
      sx={{ mt: 1, mr: 1 }}
    >
      PDF
    </Button>
  );
}