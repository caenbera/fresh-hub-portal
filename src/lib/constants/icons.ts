// src/lib/constants/icons.ts
import {
    Shield,
    Award,
    Crown,
    Star,
    Gift,
    Trophy,
    Medal,
    PiggyBank,
    Ticket,
    Sparkles,
    Leaf,
    Heart,
    Gem,
    Zap,
    Flame,
    Truck,
  } from 'lucide-react';
  
  export const allowedIcons = [
    { name: 'Shield', component: Shield },
    { name: 'Award', component: Award },
    { name: 'Crown', component: Crown },
    { name: 'Star', component: Star },
    { name: 'Gift', component: Gift },
    { name: 'Trophy', component: Trophy },
    { name: 'Medal', component: Medal },
    { name: 'PiggyBank', component: PiggyBank },
    { name: 'Ticket', component: Ticket },
    { name: 'Sparkles', component: Sparkles },
    { name: 'Leaf', component: Leaf },
    { name: 'Heart', component: Heart },
    { name: 'Gem', component: Gem },
    { name: 'Zap', component: Zap },
    { name: 'Flame', component: Flame },
    { name: 'Truck', component: Truck },
  ] as const;
  
  export type IconName = (typeof allowedIcons)[number]['name'];
  export const iconNames = allowedIcons.map(icon => icon.name);