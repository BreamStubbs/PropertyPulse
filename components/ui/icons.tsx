import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export const Icon = {
  Dashboard: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  Properties: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M3 10.5 12 4l9 6.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M9.5 20v-5h5v5" />
    </svg>
  ),
  Tasks: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <path d="m3.5 6 1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2" />
    </svg>
  ),
  Proposals: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M5 3h9l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="m8.5 13 2 2 4-4" />
    </svg>
  ),
  Files: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    </svg>
  ),
  Invoices: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M6 2h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" />
      <path d="M9 8h4M9 12h6M9 16h6" />
    </svg>
  ),
  Calendar: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </svg>
  ),
  Messages: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 9 9 0 0 1-4-1L3 21l1.5-5.5a8.5 8.5 0 0 1 16.5-4Z" />
    </svg>
  ),
  Settings: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  ),
  Plus: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Bed: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M3 7v11M3 13h18v5M21 13v-2a3 3 0 0 0-3-3H8v5" />
    </svg>
  ),
  Bath: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3Z" />
      <path d="M6 12V6a2 2 0 0 1 4 0M6 19l-1 2M19 19l1 2" />
    </svg>
  ),
  Ruler: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3" y="8" width="18" height="8" rx="1.5" transform="rotate(0 12 12)" />
      <path d="M7 8v3M11 8v4M15 8v3M19 8v4" />
    </svg>
  ),
  Download: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16" />
    </svg>
  ),
  Search: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  Clock: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  Send: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
    </svg>
  ),
  Logout: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  ),
  Menu: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  ),
  Check: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="m5 12 5 5L20 6" />
    </svg>
  ),
  Sparkle: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
    </svg>
  ),
  Pin: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2.2" />
    </svg>
  ),
};
