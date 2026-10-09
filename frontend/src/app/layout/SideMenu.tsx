import { Menu } from 'antd';
import { Link, useLocation } from 'react-router';
import type { Role } from '@/shared/auth';
import { MENUS, selectedMenuPath } from './menu-config';

type SideMenuProps = { role: Role };

/** Figma "Web/Menu Item" list for the signed-in role. */
export function SideMenu({ role }: SideMenuProps) {
  const { pathname } = useLocation();
  const entries = MENUS[role];
  const selected = selectedMenuPath(entries, pathname);

  return (
    <Menu
      mode="inline"
      aria-label="Main menu"
      selectedKeys={selected ? [selected] : []}
      items={entries.map(({ label, path, icon: Icon }) => ({
        key: path,
        icon: <Icon />,
        label: <Link to={path}>{label}</Link>,
      }))}
    />
  );
}
