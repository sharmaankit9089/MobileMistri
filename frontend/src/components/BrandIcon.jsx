import { SiApple, SiSamsung, SiOneplus, SiXiaomi, SiGoogle, SiMotorola } from "react-icons/si";
import { Circle, Smartphone } from "lucide-react";

const MAP = {
  apple: SiApple,
  samsung: SiSamsung,
  oneplus: SiOneplus,
  xiaomi: SiXiaomi,
  "google-pixel": SiGoogle,
  nothing: Circle,
  realme: Smartphone,
  motorola: SiMotorola,
};

export default function BrandIcon({ slug, className = "w-8 h-8" }) {
  const Icon = MAP[slug] || Circle;
  return <Icon className={className} aria-hidden="true" />;
}
