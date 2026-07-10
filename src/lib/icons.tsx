import {
  Shirt,
  Coffee,
  ShoppingBag,
  Smartphone,
  PenLine,
  Gift,
  CreditCard,
  Mail,
  Package,
  MapPin,
  Signpost,
  Flag,
  Printer,
  CalendarDays,
  Store,
  MessageCircle,
  Palette,
  Truck,
  Presentation,
  Sparkles,
  Layers,
  ShieldCheck,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const icons = {
  shirt: Shirt,
  coffee: Coffee,
  bag: ShoppingBag,
  smartphone: Smartphone,
  pen: PenLine,
  gift: Gift,
  card: CreditCard,
  mail: Mail,
  package: Package,
  map: MapPin,
  sign: Signpost,
  flag: Flag,
  printer: Printer,
  calendar: CalendarDays,
  store: Store,
  message: MessageCircle,
  palette: Palette,
  truck: Truck,
  presentation: Presentation,
  sparkles: Sparkles,
  layers: Layers,
  shield: ShieldCheck,
  users: Users,
  zap: Zap,
} as const;

export type IconName = keyof typeof icons;

export function AppIcon({
  name,
  className,
  size = 20,
}: {
  name: IconName;
  className?: string;
  size?: number;
}) {
  const Icon = icons[name] as LucideIcon;
  return <Icon size={size} className={className} strokeWidth={1.75} />;
}

const boxSizes = {
  sm: { box: "h-9 w-9 rounded-lg", icon: 16 },
  md: { box: "h-11 w-11 rounded-xl", icon: 20 },
  lg: { box: "h-14 w-14 rounded-2xl", icon: 24 },
} as const;

const boxVariants = {
  default: "border-silver/60 bg-white text-taupe shadow-sm",
  accent: "border-brand-gold/30 bg-brand-gold/10 text-taupe",
  muted: "border-transparent bg-silver/20 text-grey-olive",
  dark: "border-parchment/10 bg-parchment/10 text-parchment",
} as const;

export function IconBox({
  name,
  size = "md",
  variant = "default",
  className,
}: {
  name: IconName;
  size?: keyof typeof boxSizes;
  variant?: keyof typeof boxVariants;
  className?: string;
}) {
  const { box, icon } = boxSizes[size];
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center border",
        box,
        boxVariants[variant],
        className,
      )}
    >
      <AppIcon name={name} size={icon} />
    </div>
  );
}
