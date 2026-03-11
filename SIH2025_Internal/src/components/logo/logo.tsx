import type { LinkProps } from '@mui/material/Link';

import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
};

export function Logo({ href = '/' }: LogoProps) {
  return (
    <Link component={RouterLink} href={href} sx={{ textDecoration: 'none', color: 'inherit', fontSize: '1.5rem', fontWeight: 'bold' }}>
      YURUS
    </Link>
  );
}