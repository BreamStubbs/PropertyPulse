import { clsx } from "@/lib/clsx";
import { initials } from "@/lib/format";

export function Avatar({
  name,
  src,
  size = 40,
  className,
}: {
  name: string;
  src?: string;
  size?: number;
  className?: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className={clsx("rounded-full object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className={clsx("flex items-center justify-center rounded-full bg-slate-200 font-medium text-slate-600", className)}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
