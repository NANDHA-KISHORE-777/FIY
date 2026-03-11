import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';

import type { NavItem } from '../nav-config-dashboard';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: NavItem[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, sx }: NavContentProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Logo Section */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Logo />
      </Box>

      {/* Top Area Section */}
      {slots?.topArea && (
        <Box sx={{ mb: 2 }}>
          {slots.topArea}
        </Box>
      )}

      {/* Optional Divider */}
      {slots?.topArea && (
        <Divider sx={{ mb: 2, borderColor: (theme : any) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08) }} />
      )}

      {/* Navigation Section */}
      <Scrollbar fillContent>
        <Box
          component="nav"
          sx={[
            {
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
              pb: 2, // Add padding bottom for better spacing
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
        >
          <Box
            component="ul"
            sx={{
              gap: 0.75, // Increased gap between nav items
              display: 'flex',
              flexDirection: 'column',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {data.map((item) => {
              const isActived = item.path === pathname;

              return (
                <ListItem 
                  disableGutters 
                  disablePadding 
                  key={item.title}
                  sx={{ 
                    mb: 0.5, // Additional margin between items
                  }}
                >
                  <ListItemButton
                    disableGutters
                    component={RouterLink}
                    href={item.path}
                    sx={[
                      (theme : any) => ({
                        pl: 2.5,
                        py: 1.25, // Increased vertical padding
                        gap: 2.5, // Increased gap between icon and text
                        pr: 2,
                        borderRadius: 1, // Slightly more rounded corners
                        typography: 'body2',
                        fontWeight: 'fontWeightMedium',
                        color: theme.vars.palette.text.secondary,
                        minHeight: 48, // Increased minimum height
                        transition: theme.transitions.create(
                          ['background-color', 'color', 'box-shadow'],
                          {
                            duration: theme.transitions.duration.shorter,
                          }
                        ),
                        ...(isActived && {
                          fontWeight: 'fontWeightSemiBold',
                          color: theme.vars.palette.primary.main,
                          bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
                          '&:hover': {
                            bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.16),
                          },
                        }),
                        ...(!isActived && {
                          '&:hover': {
                            bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
                            color: theme.vars.palette.text.primary,
                          },
                        }),
                      }),
                    ]}
                  >
                    <Box 
                      component="span" 
                      sx={{ 
                        width: 24, 
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Box 
                      component="span" 
                      sx={{ 
                        flexGrow: 1,
                        minWidth: 0, // Allow text to truncate if needed
                      }}
                    >
                      {item.title}
                    </Box>

                    {item.info && (
                      <Box component="span" sx={{ ml: 1 }}>
                        {item.info}
                      </Box>
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {/* Bottom Area Section */}
      {slots?.bottomArea && (
        <>
          <Divider sx={{ mb: 2, borderColor: (theme : any) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08) }} />
          <Box sx={{ mt: 'auto', pt: 2 }}>
            {slots.bottomArea}
          </Box>
        </>
      )}
    </>
  );
}