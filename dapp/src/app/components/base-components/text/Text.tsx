import { ReactNode } from "react";
import styles from "./Text.module.css";

export const Text = ({
  variant,
  children,
  className = "",
}: {
  variant: "title" | "header" | "subtitle" | "paragraph";
  children: ReactNode;
  className?: string;
}) =>
  ({
    title: <h1 className={`${styles.h1} ${className}`}>{children}</h1>,
    subtitle: <p className={`${styles.subtitle} ${className}`}>{children}</p>,
    header: <h3 className={className}>{children}</h3>,
    paragraph: <p className={className}>{children}</p>,
  }[variant]);
