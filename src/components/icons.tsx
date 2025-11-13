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
  BookOpen,
  LayoutDashboard,
  ToyBrick,
  AreaChart,
  Settings,
  LifeBuoy,
  ShieldCheck,
  Scale,
  ShieldQuestion,
  Database,
  Utensils,
  Bot,
  FlaskConical,
  Network,
  Cpu,
  Zap,
  UserX,
  Telescope,
  Landmark,
  Wand2,
  Sparkles,
  CircleDashed,
  MessageSquareHeart,
  TrendingUp,
  UserCheck,
  Fingerprint,
  Binary,
  ShieldAlert,
  Repeat,
  Gem,
  Briefcase,
  Users,
  Receipt,
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
  Wand2,
  Sparkles,
  Cpu,
  CircleDashed,
  MessageSquareHeart,
  UserCheck,
  Fingerprint,
  ShieldAlert,
  Repeat,
  Gem,
  Briefcase,
  Users,
  Receipt,
};

export const navIcons = {
  Dashboard: LayoutDashboard,
  DataManager: Database,
  Taxonomy: BookOpen,
  ModelHub: ToyBrick,
  Analytics: AreaChart,
  SimulationLab: FlaskConical,
  Settings: Settings,
  Support: LifeBuoy,
  Bias: Scale,
  Security: ShieldCheck,
  Trips: Briefcase,
};

export const getCategoryIcon = (
  iconName: keyof typeof categoryIcons
): LucideIcon => {
  return categoryIcons[iconName] || ShoppingCart;
};
