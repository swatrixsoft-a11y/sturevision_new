import Link from "next/link";
import { cn } from "@/utils/cn";

type BrandLogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg" | "xl";
  theme?: "dark" | "light";
  showWordmark?: boolean;
  className?: string;
};

const sizeMap = {
  sm: {
    root: "gap-2",
    mark: "h-8 w-8 rounded-xl",
    icon: "h-5 w-5",
    text: "text-lg",
    dot: "h-1.5 w-1.5",
  },
  md: {
    root: "gap-2.5",
    mark: "h-10 w-10 rounded-2xl",
    icon: "h-6 w-6",
    text: "text-2xl",
    dot: "h-2 w-2",
  },
  lg: {
    root: "gap-3",
    mark: "h-14 w-14 rounded-2xl",
    icon: "h-8 w-8",
    text: "text-3xl",
    dot: "h-2.5 w-2.5",
  },
  xl: {
    root: "gap-4",
    mark: "h-16 w-16 rounded-[1.35rem]",
    icon: "h-9 w-9",
    text: "text-4xl",
    dot: "h-3 w-3",
  },
};

function BrandMark({ size, className }: { size: BrandLogoProps["size"]; className?: string }) {
  const styles = sizeMap[size ?? "sm"];

  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", styles.mark, className)}>
      <span className="absolute -inset-1 rounded-[inherit] bg-gradient-to-br from-cyan-400/25 via-violet-500/25 to-fuchsia-500/25 blur-md transition duration-300 group-hover:opacity-100" />
      <span className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_28%),linear-gradient(135deg,#22d3ee_0%,#6366f1_45%,#d946ef_100%)] shadow-lg shadow-indigo-500/35" />
      <span className="absolute inset-[2px] rounded-[inherit] border border-white/30" />
      <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.85)]" />
      <svg
        className={cn("relative z-10 drop-shadow-sm", styles.icon)}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M27.7 9.5H17.1c-4.5 0-7.4 2.2-7.4 5.7 0 3.1 2.1 4.7 6.4 5.3l6.7.9c3.5.5 5.2 1.9 5.2 4.4 0 3.4-3 5.7-7.6 5.7H10.9"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24.9 5.6 13.8 34.4"
          stroke="white"
          strokeWidth="3.2"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M29.7 15.4h3.2M31.3 13.8V17"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    </span>
  );
}

function Wordmark({ size, theme }: { size: BrandLogoProps["size"]; theme: BrandLogoProps["theme"] }) {
  const styles = sizeMap[size ?? "sm"];
  const isLight = theme === "light";

  return (
    <span className={cn("inline-flex items-baseline font-black tracking-tight", styles.text)}>
      <span className={isLight ? "text-slate-950" : "text-white"}>Stur</span>
      <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
        evision
      </span>
      <span className={cn("ml-1.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.7)]", styles.dot)} />
    </span>
  );
}

export default function BrandLogo({
  href = "/",
  size = "sm",
  theme = "dark",
  showWordmark = true,
  className,
}: BrandLogoProps) {
  const styles = sizeMap[size];
  const content = (
    <>
      <BrandMark size={size} />
      {showWordmark && <Wordmark size={size} theme={theme} />}
    </>
  );

  if (!href) {
    return <div className={cn("group inline-flex items-center", styles.root, className)}>{content}</div>;
  }

  return (
    <Link href={href} className={cn("group inline-flex items-center", styles.root, className)}>
      {content}
    </Link>
  );
}
