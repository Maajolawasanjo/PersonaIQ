import {
  ChartNoAxesCombined,
  ClipboardList,
  House,
  Layers3,
  Settings2,
  Shirt,
  Sparkles,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

export interface WorkspaceNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const primaryNavigation: WorkspaceNavItem[] = [
  { label: 'Home', href: '/dashboard', icon: House },
  { label: 'Prepare for an Event', href: '/journey/start', icon: Sparkles },
  { label: 'My Wardrobe', href: '/wardrobe', icon: Shirt },
  { label: 'AI Stylist', href: '/wardrobe/style-me', icon: Layers3 },
  { label: 'Activity', href: '/dashboard/history', icon: ClipboardList },
];

export const accountNavigation: WorkspaceNavItem[] = [
  { label: 'Saved Plans', href: '/dashboard/plans', icon: Layers3 },
  { label: 'Progress', href: '/dashboard/progress', icon: ChartNoAxesCombined },
  { label: 'Profile', href: '/dashboard/profile', icon: UserRound },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings2 },
];

export const mobilePrimaryNavigation = [
  primaryNavigation[0],
  primaryNavigation[1],
  primaryNavigation[2],
  primaryNavigation[4],
] as const;

export function isWorkspaceRouteActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === href;
  if (href === '/journey/start') return pathname.startsWith('/journey/');
  if (href === '/wardrobe') return pathname === '/wardrobe';
  return pathname === href || pathname.startsWith(href + '/');
}
