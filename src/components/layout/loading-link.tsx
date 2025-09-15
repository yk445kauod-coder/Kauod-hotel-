// src/components/layout/loading-link.tsx
"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { useLoader } from "@/context/loader-context";
import React, { PropsWithChildren } from "react";

type LoadingLinkProps = LinkProps & {
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

const LoadingLink = React.forwardRef<HTMLAnchorElement, PropsWithChildren<LoadingLinkProps>>(
  ({ href, children, className, onClick, ...props }, ref) => {
    const pathname = usePathname();
    const { setIsLoading } = useLoader();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // If the route is the same, do nothing.
      if (pathname === href.toString()) {
        e.preventDefault();
        return;
      }
      
      // If there's a custom onClick, execute it.
      if (onClick) {
        onClick(e);
      }

      // If the link is opening in a new tab, don't show the loader.
      if (e.metaKey || e.ctrlKey) {
        return;
      }

      // Show the loader.
      if(!e.isDefaultPrevented()){
          setIsLoading(true);
      }
    };

    return (
      <Link href={href} onClick={handleClick} className={className} ref={ref} {...props}>
        {children}
      </Link>
    );
  }
);

LoadingLink.displayName = "LoadingLink";

export default LoadingLink;
