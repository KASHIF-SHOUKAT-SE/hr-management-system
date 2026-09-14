import Image from "next/image";

interface AvatarProps {
  src?: string;
  name: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, name, size = 36, className = "" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}
