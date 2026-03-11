
import type { Theme, SxProps } from '@mui/material/styles';
import { forwardRef } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';

// ----------------------------------------------------------------------

export interface MainCardProps {
  children?: React.ReactNode;
  content?: boolean;
  contentSX?: SxProps<Theme>;
  darkTitle?: boolean;
  divider?: boolean;
  elevation?: number;
  secondary?: React.ReactNode;
  shadow?: string;
  sx?: SxProps<Theme>;
  title?: React.ReactNode;
  modal?: boolean;
  [key: string]: any;
}

// ----------------------------------------------------------------------

const MainCard = forwardRef<HTMLDivElement, MainCardProps>(
  (
    {
      children,
      content = true,
      contentSX = {},
      darkTitle,
      divider = true,
      elevation,
      secondary,
      shadow,
      sx = {},
      title,
      modal = false,
      ...other
    },
    ref
  ) => {
    const boxShadow = shadow ? shadow : 'inherit';

    return (
      <Card
        elevation={elevation || 0}
        ref={ref}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          ':hover': {
            boxShadow,
          },
          ...(modal && {
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: `calc(100vw - 48px)`, sm: 'auto' },
            '& .MuiCardContent-root': {
              overflowY: 'auto',
              minHeight: 'auto',
              maxHeight: `calc(100vh - 200px)`,
            },
          }),
          ...sx,
        }}
        {...other}
      >
        {/* card header and action */}
        {!darkTitle && title && (
          <CardHeader
            sx={{ p: 2.5 }}
            title={title}
            action={secondary}
          />
        )}
        {darkTitle && title && (
          <CardHeader 
            sx={{ p: 2.5 }} 
            title={title} 
            action={secondary}
          />
        )}

        {/* content & header divider */}
        {title && divider && <Divider />}

        {/* card content */}
        {content && (
          <CardContent sx={{ p: 2.5, ...contentSX }}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    );
  }
);

MainCard.displayName = 'MainCard';

export default MainCard;
