"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderLink } from "@/types/header";

interface RenderLinkProps {
  link: HeaderLink;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export function RenderLink({ 
  link, 
  className = "", 
  activeClassName = "text-primary font-bold", 
  inactiveClassName = "text-muted hover:text-primary transition-colors" 
}: RenderLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === link.link;

  // Define styling based on isPrimary
  const getLinkStyling = () => {
    if (link.isPrimary) {
      // Primary links use the default styling
      return {
        active: activeClassName,
        inactive: inactiveClassName
      };
    } else {
      // Non-primary links use light gray with white when active
      return {
        active: "text-white font-medium",
        inactive: "text-gray-400 hover:text-white transition-colors"
      };
    }
  };

  const { active, inactive } = getLinkStyling();

  if (link.isExternal) {
    return (
      <a
        href={link.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} ${inactive}`}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link
      href={link.link}
      className={`${className} ${isActive ? active : inactive}`}
    >
      {link.label}
    </Link>
  );
} 