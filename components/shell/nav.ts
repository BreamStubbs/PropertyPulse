import { Icon } from "@/components/ui/icons";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Icon.Dashboard },
  { href: "/properties", label: "Properties", icon: Icon.Properties },
  { href: "/tasks", label: "Tasks", icon: Icon.Tasks },
  { href: "/proposals", label: "Proposals", icon: Icon.Proposals },
  { href: "/files", label: "Files", icon: Icon.Files },
  { href: "/invoices", label: "Invoices", icon: Icon.Invoices },
  { href: "/calendar", label: "Calendar", icon: Icon.Calendar },
  { href: "/messages", label: "Messages", icon: Icon.Messages },
  { href: "/settings", label: "Settings", icon: Icon.Settings },
] as const;
