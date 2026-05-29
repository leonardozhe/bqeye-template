'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Paper from '@mui/material/Paper';
import Badge from '@mui/material/Badge';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useCartStore } from '@/lib/cartStore';

const navItems = [
  { label: 'Home', icon: HomeOutlinedIcon, href: '/' },
  { label: 'Categories', icon: CategoryOutlinedIcon, href: '/products' },
  { label: 'Search', icon: SearchOutlinedIcon, href: '/search' },
  { label: 'Cart', icon: ShoppingCartOutlinedIcon, href: '/cart' },
  { label: 'Account', icon: PersonOutlineOutlinedIcon, href: '/account' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        display: { xs: 'flex', md: 'none' },
        justifyContent: 'space-around',
        alignItems: 'center',
        py: 1,
        borderTop: '1px solid #f5f6f7' }}
    >
      {navItems.map((item) => {
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : pathname?.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: isActive ? '#463AE8' : '#808080',
              fontSize: '0.7rem',
              gap: '2px',
              minWidth: '56px' }}
          >
            {item.label === 'Cart' ? (
              <Badge badgeContent={totalItems} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: '16px', minWidth: '16px' } }}>
                <Icon fontSize="small" />
              </Badge>
            ) : (
              <Icon fontSize="small" />
            )}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </Paper>
  );
}
