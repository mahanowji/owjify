import {
  Wrench,
  Code2,
  Building2,
  GraduationCap,
  Car,
  Briefcase,
  Camera,
  Cpu,
  Sparkles,
} from 'lucide-react';

const ICON_MAP = {
  Wrench,
  Code2,
  Building2,
  GraduationCap,
  Car,
  Briefcase,
  Camera,
  Cpu,
};

export default function CategoryIcon({ name, size = 22, strokeWidth = 1.8 }) {
  const IconComp = ICON_MAP[name] || Sparkles;
  return <IconComp size={size} strokeWidth={strokeWidth} />;
}
