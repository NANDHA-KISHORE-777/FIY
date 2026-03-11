import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Analytics',
    path: '/analytics',
    icon: icon('ic-analytics'),
  },
  {
    title: 'IPC Library',
    path: '/ipc-library',
    icon: icon('ic-blog'),
  },
  {
    title: 'Complaints',
    path: '/complaints',
    icon: icon('ic-user'),
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: icon('ic-blog'),
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: icon('ic-lock'),
  },
];
