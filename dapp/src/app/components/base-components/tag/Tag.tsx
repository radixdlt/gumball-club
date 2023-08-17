import { ReactNode } from "react";
import styles from "./Tag.module.css";

export const Tag = ({
  children,
  color,
  icon = "none",
}: {
  children: ReactNode;
  color: "blue" | "pink";
  icon?: "market" | "none";
}) => {
  const iconClass = icon ? { market: styles["market"], none: "" }[icon] : "";

  return (
    <div className={`${styles.tag} ${styles[color]} ${iconClass}`}>
      {children}
    </div>
  );
};
