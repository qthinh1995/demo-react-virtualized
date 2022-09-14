import React from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import style from "./style.module.css";

const Link = ({
  href,
  children,
  activeClassName = "active",
}: {
  href: string;
  children: React.ReactNode;
  activeClassName?: string;
}) => {
  const { asPath, pathname } = useRouter();

  const child = React.Children.only(children);
  const childClassName = child?.props?.className || "";

  const isActive = pathname === href;

  const className = isActive
    ? `${childClassName} ${activeClassName}`.trim()
    : childClassName;

  return (
    <NextLink href={href}>
      <a>
        {React.cloneElement(child, {
          className: className || null,
          isActive,
        })}
      </a>
    </NextLink>
  );
};

export default Link;
