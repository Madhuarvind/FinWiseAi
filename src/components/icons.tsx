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
  Database,
  Utensils,
  Bot,
  FlaskConical,
  Wand2,
  Sparkles,
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
  Activity,
  BookText,
  Eye,
  SearchCode,
  FileText,
  Binary,
  Network,
  Telescope,
  TrendingUp,
  AlertTriangle,
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
  Activity,
  BookText,
  Eye,
  SearchCode,
  FileText,
  Binary,
  Network,
  Telescope,
  TrendingUp,
  AlertTriangle,
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
  Policy: FileText,
};

export const getCategoryIcon = (
  iconName: keyof typeof categoryIcons
): LucideIcon => {
  return categoryIcons[iconName] || ShoppingCart;
};

    