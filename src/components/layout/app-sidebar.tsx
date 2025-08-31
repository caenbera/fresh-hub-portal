import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sprout, LayoutDashboard, ShoppingCart, Apple, Package, Users, History } from 'lucide-react';
import { SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useAuth } from '@/context/auth-context';

const clientNav = [
  { href: '/portal', label: 'New Order', icon: ShoppingCart },
  { href: '/portal/history', label: 'Order History', icon: History },
];

const adminNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'Manage Orders', icon: Package },
  { href: '/dashboard/products', label: 'Manage Products', icon: Apple },
];

const superAdminNav = [
  { href: '/dashboard/users', label: 'Manage Users', icon: Users },
];

export function AppSidebar() {
  const { role } = useAuth();
  const pathname = usePathname();

  const getNavItems = () => {
    switch (role) {
      case 'superadmin':
        return [...adminNav, ...superAdminNav];
      case 'admin':
        return adminNav;
      case 'client':
        return clientNav;
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">Fresh Hub</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
