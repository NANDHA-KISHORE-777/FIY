import { useRef, useState } from 'react';
import type { Breakpoint } from '@mui/material/styles';

import { merge } from 'es-toolkit';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Fab from '@mui/material/Fab';
import { useTheme } from '@mui/material/styles';

import { _notifications } from 'src/_mock';

import { SimpleChatbot } from 'src/components/chatbot';
import { AccountPopover } from '../components/account-popover';
import { layoutClasses } from '../core/classes';
import { dashboardLayoutVars } from './css-vars';
import { HeaderSection } from '../core/header-section';
import { LanguagePopover } from '../components/language-popover';
import { LayoutSection } from '../core/layout-section';
import { MainSection } from '../core/main-section';
import { MenuButton } from '../components/menu-button';
import { _account } from '../nav-config-account';
import { navData } from '../nav-config-dashboard';
import { NavMobile, NavDesktop } from './nav';
import { NotificationsPopover } from '../components/notifications-popover';
import { Searchbar } from '../components/searchbar';

import type { MainSectionProps } from '../core/main-section';
import type { HeaderSectionProps } from '../core/header-section';
import type { LayoutSectionProps } from '../core/layout-section';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type DashboardLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    main?: MainSectionProps;
  };
};

export function DashboardLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'lg',
}: DashboardLayoutProps) {
  const theme = useTheme();
  const fabRef = useRef(null);

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const renderHeader = () => {
    const headerSlotProps: HeaderSectionProps['slotProps'] = {
      container: {
        maxWidth: false,
      },
    };

    const headerSlots: HeaderSectionProps['slots'] = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ) as React.ReactNode,
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
            onClick={onOpen}
            sx={{ mr: 1, ml: -1, [theme.breakpoints.up(layoutQuery)]: { display: 'none' } }}
          />
          <NavMobile data={navData} open={open} onClose={onClose} />
        </>
      ) as React.ReactNode,
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 1.5 } }}>
          {/** @slot Searchbar */}
          <Searchbar />

          {/** @slot Language popover */}
          <LanguagePopover />

          {/** @slot Notifications popover */}
          <NotificationsPopover data={_notifications} />

          {/** @slot Account drawer */}
          <AccountPopover data={_account} />
        </Box>
      ) as React.ReactNode,
    };

    return (
      <HeaderSection
        disableElevation
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderFooter = () => null;

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Sidebar
       *************************************** */
      sidebarSection={
        <NavDesktop data={navData} layoutQuery={layoutQuery} />
      }
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{ ...dashboardLayoutVars(theme), ...cssVars }}
      sx={[
        {
          [`& .${layoutClasses.sidebarContainer}`]: {
            [theme.breakpoints.up(layoutQuery)]: {
              pl: 'var(--layout-nav-vertical-width)',
              transition: theme.transitions.create(['padding-left'], {
                easing: 'var(--layout-transition-easing)',
                duration: 'var(--layout-transition-duration)',
              }),
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {renderMain()}
      <SimpleChatbot
        open={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
      />
      <Fab
        ref={fabRef}
        aria-label="Open chatbot"
        onClick={() => setChatbotOpen(!chatbotOpen)}
        sx={{ 
          position: 'fixed', 
          bottom: 40, 
          right: 40,
          width: 56,
          height: 56,
          bgcolor: '#ffffff',
          color: '#667eea',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          border: '1px solid #e0e0e0',
          zIndex: 2001, // Higher than chatbot to stay visible
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: '#f8f9fa',
            boxShadow: '0 6px 25px rgba(0,0,0,0.2)',
            transform: 'scale(1.05)',
          }
        }}
      >
        <Box
          component="img"
          src="/src/components/assets/robot.png"
          sx={{
            width: 36,
            height: 36,
          }}
        />
      </Fab>
    </LayoutSection>
  );
}
