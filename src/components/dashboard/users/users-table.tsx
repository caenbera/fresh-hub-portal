import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { UserProfile, UserRole } from '@/types';
import { useAuth } from '@/context/auth-context';
import { useTranslations } from 'next-intl';

interface UsersTableProps {
  users: UserProfile[];
  onRoleChange: (user: UserProfile, newRole: 'admin' | 'client') => void;
  isUpdating: boolean;
}

export function UsersTable({ users, onRoleChange, isUpdating }: UsersTableProps) {
  const { user: currentUser } = useAuth();
  const t = useTranslations('AdminUsersPage');

  const getRoleVariant = (role: UserRole) => {
    switch (role) {
      case 'superadmin': return 'destructive';
      case 'admin': return 'secondary';
      case 'client':
      default:
        return 'outline';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('table_header_business')}</TableHead>
          <TableHead>{t('table_header_email')}</TableHead>
          <TableHead>{t('table_header_role')}</TableHead>
          <TableHead>
            <span className="sr-only">{t('table_header_actions')}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length > 0 ? (
          users.map((user) => (
            <TableRow key={user.uid}>
              <TableCell className="font-medium">{user.businessName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={getRoleVariant(user.role)} className="capitalize">
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {user.uid !== currentUser?.uid && user.role !== 'superadmin' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isUpdating}>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t('table_action_change_role')}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        disabled={user.role === 'admin'}
                        onSelect={() => onRoleChange(user, 'admin')}
                      >
                        {t('table_action_make_admin')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={user.role === 'client'}
                        onSelect={() => onRoleChange(user, 'client')}
                      >
                        {t('table_action_make_client')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              {t('table_no_users')}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
