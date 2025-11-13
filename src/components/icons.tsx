import {
  BrainCircuit,
  Car,
  HeartPulse,
  Home,
  type LucideIcon,
  Lightbulb,
  Plane,
  ShoppingCart,
  ShoppingBasket,
  Smile,
  Ticket,
  Utensils,
  BookOpen,
  LayoutDashboard,
} from 'lucide-react';

export const Logo = () => (
  <div className="flex items-center justify-center gap-2 font-headline text-lg font-semibold text-sidebar-foreground">
    <BrainCircuit className="size-6 text-primary" />
    <span className="text-primary-foreground">FinWiseAI</span>
  </div>
);

export const categoryIcons = {
  Utensils,
  ShoppingCart,
  Car,
  ShoppingBasket,
  Home,
  Ticket,
  HeartPulse,
  Lightbulb,
  Plane,
  Smile,
};

export const navIcons = {
  Dashboard: LayoutDashboard,
  Taxonomy: BookOpen,
};

export const getCategoryIcon = (
  iconName: keyof typeof categoryIcons
): LucideIcon => {
  return categoryIcons[iconName] || ShoppingCart;
};
