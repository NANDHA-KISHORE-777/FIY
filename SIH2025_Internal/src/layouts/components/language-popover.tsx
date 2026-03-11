import type { ButtonProps } from '@mui/material/Button';

import { useContext, useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { Iconify } from 'src/components/iconify';
import { LanguageContext } from 'src/context/language-context';

// ----------------------------------------------------------------------

const indianLanguages = [
    { value: 'en-IN', label: 'English (India)' },
    { value: 'hi-IN', label: 'Hindi' },
    { value: 'bn-IN', label: 'Bengali' },
    { value: 'ta-IN', label: 'Tamil' },
    { value: 'te-IN', label: 'Telugu' },
    { value: 'mr-IN', label: 'Marathi' },
    { value: 'gu-IN', label: 'Gujarati' },
    { value: 'kn-IN', label: 'Kannada' },
    { value: 'ml-IN', label: 'Malayalam' },
    { value: 'pa-IN', label: 'Punjabi' },
    { value: 'or-IN', label: 'Odia' },
    { value: 'as-IN', label: 'Assamese' },
    { value: 'ur-IN', label: 'Urdu' },
];

export type LanguagePopoverProps = ButtonProps & {};

export function LanguagePopover({ sx, ...other }: LanguagePopoverProps) {
  const { open, anchorEl, onClose, onOpen } = usePopover();
  const languageContext = useContext(LanguageContext);

  const handleChangeLang = useCallback(
    (newLang: string) => {
      languageContext?.setLanguage(newLang);
      onClose();
    },
    [onClose, languageContext]
  );

  const currentLang = indianLanguages.find((lang) => lang.value === languageContext?.language);

  const renderMenuList = () => (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MenuList
        sx={{
          p: 0.5,
          gap: 0.5,
          width: 160,
          minHeight: 72,
          display: 'flex',
          flexDirection: 'column',
          [`& .${menuItemClasses.root}`]: {
            px: 1,
            gap: 2,
            borderRadius: 0.75,
            [`&.${menuItemClasses.selected}`]: {
              bgcolor: 'action.selected',
              fontWeight: 'fontWeightSemiBold',
            },
          },
        }}
      >
        {indianLanguages.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === currentLang?.value}
            onClick={() => handleChangeLang(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Popover>
  );

  return (
    <>
      <Button
        aria-label="Languages button"
        onClick={onOpen}
        endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
        sx={[
          (theme) => ({
            p: '8px 12px',
            height: 40,
            border: `1px solid ${theme.vars.palette.divider}`,
            ...(open && { bgcolor: theme.vars.palette.action.selected }),
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {currentLang?.label || 'Select Language'}
      </Button>

      {renderMenuList()}
    </>
  );
}